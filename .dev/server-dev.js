import https from 'https';
import express from 'express';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';

import dns from 'node:dns';
import os from 'node:os';

const port = process.env.PORT;
const app = express();
let server = app;
const key = fs.existsSync(process.env.HTTPSKEY) && fs.readFileSync(path.resolve(process.env.HTTPSKEY || '')).toString();
const cert = fs.existsSync(process.env.HTTPSCRT) && fs.readFileSync(path.resolve(process.env.HTTPSCRT || '')).toString();
const isHTTPS = key && cert;
const IP = await new Promise((r) => {
    dns.lookup(os.hostname(), { family: 4 }, (err, addr) => {
        r(addr);
    });
});

if (isHTTPS) {
    server = https.createServer({ key, cert }, app);
}

app.use('/data.json', express.static(path.resolve('./data.json'), { type: 'application/json' }));
app.use('/', [express.static(path.resolve(process.env.BUILD_FOLDER || './_build/assets')), express.static(path.resolve('./public'))]);
app.use('/', (req, res, next) => {
    // console.log('req.path', req.path);
    return res.sendFile(path.resolve('./_build/index.html'));
});

// Обработка 404 ошибок для несуществующих маршрутов
app.use((req, res, next) => {
    return res.status(404).sendFile(path.resolve(process.env.BUILD_FOLDER, '404/index.html'));
});

server.listen(port, () => {
    console.log(`-------------------------------------`);
    isHTTPS && console.log(`${chalk.hex('#325EE0')('HTTPS MODE:')}    enabled`);
    console.log(`${chalk.hex('#325EE0')('Static server:')} http${isHTTPS ? 's' : ''}://localhost:${port}`);
    console.log(`${chalk.hex('#325EE0')('Network      :')} http://${IP}:${port}`);
    console.log(`-------------------------------------`);
    process.send?.('started');
});
