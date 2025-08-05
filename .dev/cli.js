#!/usr/bin/env node
import minimist from 'minimist';
import { spawn, exec } from 'node:child_process';
import path from 'node:path';

const [, , ...args] = process.argv;
const argv = minimist(process.argv.slice(2));

// const spawnParams = ['nodemon', ['--import', './.dev/loader/register-hooks.mjs', './.dev/gulp.dev.js', 'dev']]
// const spawnParams = ['node', ['--import', './.dev/loader/register-hooks.mjs', '--import', 'tsx', './.dev/gulp.dev.js', ...args]]
// const spawnParams = ['tsx', ['--import', './.dev/loader/loaders.mjs', './.dev/gulp.dev.js', 'dev']]

const node = argv.debug ? 'nodemon' : 'node';
const config = [];

if (argv.debug) config.push('--config', './.dev/nodemon.json');
config.push('--import', './.dev/loader/register-hooks.mjs', '--import', 'tsx', './.dev/gulp.dev.js');

const spawnParams = [node, [...config, ...args]];
console.log(node, ...config, ...args);

const ps = spawn(...spawnParams, {
    cwd: path.resolve(),
    shell: true,
    detached: false,
    stdio: [
        'inherit', // stdin
        'inherit', // stdout
        'inherit', // stderr
    ],
});
