import fs from 'node:fs';
import path from 'node:path';
import { fork, spawn, spawnSync } from 'node:child_process';
import minimist from 'minimist';
import gulp from 'gulp';
import esbuild from 'esbuild';

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import 'dotenv/config';
import liveReloader from './.dev/live-reloader/server.js';
import task from './.dev/utils/task-decorator.js';
import chalk from 'chalk';
import findFreePort from './.dev/utils/find-free-port.js';
import { renderStaticTask } from './.dev/render.js';

const argv = minimist(process.argv.slice(2));
const scss = gulpSass(dartSass);
const { series, parallel, src, dest, watch } = gulp;
const isHTTPS = process.env.HTTPSKEY && process.env.HTTPSCRT;
const protocol = 'http' + (isHTTPS ? 's' : '');

process.env.PORT = process.env.PORT || (await findFreePort(8080));
process.env.WSPORT = process.env.WSPORT || (await findFreePort(8000));
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.BUILD_FOLDER = process.env.BUILD_FOLDER || '_build';
process.env.URL = process.env.URL || `${protocol}://localhost:${process.env.PORT}`;

const packageJSON = JSON.parse(fs.readFileSync('./package.json').toString());
console.clear();
console.log(chalk.hex('#325EE0')(`[${packageJSON.name.toUpperCase()}]`));

const updateData = async () => {
    const data = await fetch('https://galitskiy-galitskiy.ru/local/ajax/data/').then((res) => res.json());
    fs.writeFileSync('./public/data.json', Buffer.from(JSON.stringify(data)));
};

await updateData();

const softError = (e) => {
    return [
        'error',
        function (e) {
            this.emit('end');
            console.error(e.message);
        },
    ];
};

const js = task('js', (done) => {
    const entryPoints = fs
        .readdirSync('js', { withFileTypes: true })
        ?.filter((item) => path.extname(item.name).toLowerCase() === '.js')
        ?.map((item) => 'js/' + item.name);

    const config = {
        bundle: true,
        platform: 'browser',

        minify: false,
        sourcemap: !argv.prod && 'inline',
    };

    try {
        esbuild.buildSync(
            Object.assign(config, {
                entryPoints,
                outdir: process.env.BUILD_FOLDER + '/assets/js',
                jsx: 'transform',
                jsxFactory: '_jsx',
                jsxFragment: '_jsxFragment',
                inject: ['.dev/jsx-factory/inject.js'],
                loader: {
                    '.njk': 'text',
                    '.glsl': 'text',
                    '.frag': 'text',
                    '.vert': 'text',
                },

                // logLevel: 'debug',
            })
        );
    } catch (error) {
        console.log('GULP ESBUILD ERROR');
        // console.error(error);
    }

    done();
});

const styles = task('styles', (done) => {
    return (
        src('styles/*.scss')
            // .pipe(gulpif(!argv.prod, sourcemaps.init()))
            .pipe(scss().on(...softError()))
            // .pipe(gulpif(!argv.prod, sourcemaps.write('.')))
            .pipe(dest(process.env.BUILD_FOLDER + '/assets/styles'))
    );
});

const publicFiles = task('publicFiles', () => {
    return src('public/**/*.*', { encoding: false }).pipe(dest(process.env.BUILD_FOLDER));
});

const clean = task('clean', (done) => {
    // INFO: удаляет содержимое, но не саму папку
    const dir = process.env.BUILD_FOLDER;
    fs.existsSync(dir) &&
        fs.readdirSync(dir).forEach((f) => {
            if (f === '.git') return; // WARN: никогда не удалять папку .git, какая бы папка не была указана
            fs.rmSync(`${dir}/${f}`, { recursive: true });
        });

    done();
});

let browserOpened = false;
const open = (done) => {
    if (!browserOpened) {
        const openCommand = process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open';
        const url = `${protocol}://localhost:${process.env.PORT}`;

        spawnSync(`${openCommand} ${url}`, [], { shell: true });
        browserOpened = true;
    }

    done();
};

// INFO: Для статики мы используем ./server-dev.js, который просто отдает статику и может работать в режиме https. Ничего более
let processID;
const devServer = task('server', (done) => {
    const args = [];
    processID && processID.kill('SIGINT');

    if (argv._[1]) {
        processID = fork(argv._[1], args);
    } else {
        processID = fork('./.dev/server-dev.js', args);
    }

    processID.on('message', (message) => {
        if (message === 'started') done();
    });

    processID.on('error', () => {
        console.log('ERRRRRRRRRRRRRRRRR');
        done();
    });

    processID.on('exit', () => {
        done();
    });
});

//INFO: нельзя использовать async await в задачах с декоратором?
const render = task('render', (done) => {
    // INFO: если используем done, то нельзя возвращать результат
    renderStaticTask(done); // WARN: кеширует

    // через процесс
    /* const subprocess = fork('./.dev/render.js');
    subprocess.once("message", message => {
        done();
    });

    subprocess.on("error", error => {
        console.log('Error on rendering', error);
    });

    subprocess.on("exit", error => {
        // console.log('Exit', error);
    }); */
});

const setProduction = (done) => {
    process.env.NODE_ENV = 'production';
    done();
};

const watchFiles = task('watchFiles', (done) => {
    let reloadTimeout;
    const { broadcastWSMessage } = liveReloader(process.env.WSPORT);
    const reloadThrottle = 500;

    const reload = task('reload', (done) => {
        clearTimeout(reloadTimeout);
        reloadTimeout = setTimeout(() => {
            broadcastWSMessage({ message: 'reload' });
        }, reloadThrottle);

        if (!done) {
            return true;
        } else {
            done();
        }
    });

    const stream = (message) => {
        broadcastWSMessage({
            message,
        });
    };

    const injectCSS = task('injectCSS', (done) => {
        stream('injectCSS');
        done();
    });

    const customServer = argv._[1];

    watch('js/**/*.*', series(js, reload));
    watch(['layouts/**/*.*', 'pages/**/*.*', 'components/**/*.*'], customServer ? series(js, devServer, reload) : series(js, render, reload));
    watch('styles/**/*.scss', series(styles, injectCSS));
    watch('server/**/*.*', series(devServer, reload));
    // watch('public/**/*.*', series(publicFiles, reload));

    done();
});

const tasks = {
    // Remove render when real server used
    start: series(clean, /* publicFiles, */ devServer, render, js, styles, watchFiles, open),
    dev: series(clean, /* publicFiles, */ devServer, render, js, styles, watchFiles),
    server: series(clean, /* publicFiles, */ js, styles, devServer, watchFiles),
    build: series(setProduction, clean, render, publicFiles, js, styles),
};

(() => {
    const taskList = argv._;

    if (!taskList[0]) {
        console.error('Task required. Specify in package.json. Available tasks: ' + Object.keys(tasks).join(' | '));
        return process.exit(2);
    }

    tasks[taskList[0]]();
})();
