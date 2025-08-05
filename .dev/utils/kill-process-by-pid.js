import { exec } from 'node:child_process';

const killProcess = (pid) =>
    exec(`taskkill /pid ${pid} /t`, (err, stdout, stderr) => {
        if (err) {
            console.log('ERR', err);
            throw err;
        }

        console.log('stdout', stdout);
        console.log('stderr', err);
    });

export default killProcess;
