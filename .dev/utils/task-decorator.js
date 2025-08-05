import chalk from 'chalk';
// INFO: декоратор нужен из-за того, что стандартный не работает.
// А не работает потому что мы вызываем не через cli, а через ЛОАДЕР

const start = (name) => {
    const startDate = new Date().toLocaleString().split(', ')[1];

    console.log(`[${chalk.gray(startDate)}]`, 'Starting', chalk.hex('#325EE0')(name), '...');
};

const finish = (name, d) => {
    const endDate = new Date().toLocaleString().split(', ')[1];
    const diff = Math.floor(performance.now() - d);
    console.log(`[${chalk.gray(endDate)}]`, chalk.hex('#325EE0')(name), diff + 'ms');
    // console.log(`[${chalk.gray(endDate)}]`, 'Finished', chalk.hex('#325EE0')(name), 'finished in', diff + 'ms');
};

const wait = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const taskDecorator = (name, task) => {
    return (done) => {
        const startTime = performance.now();
        // start(name);
        let t;

        t = task(() => {
            finish(name, startTime);
            done();
        });

        // Streams
        if (t?.pipe) {
            t.on('end', (end) => {});

            t.on('data', (data) => {});

            t.on('pipe', (pipe) => {
                finish(name, startTime);
                done();
            });

            t.on('close', (close) => {
                // finish(name, startTime);
                done();
            });

            t.on('error', (err) => {
                console.log('err', err.message);
                finish(name, startTime);
                done();
            });

            t.on('finish', async (f) => {
                finish(name, startTime);
                done();
            });
        }

        // Promises
        t?.then &&
            t
                .then(() => {
                    finish(name, startTime);
                    done();
                })
                .catch((err) => {
                    console.log('catch', err.message);
                    finish(name, startTime);
                    done();
                });
    };
};

export default taskDecorator;
