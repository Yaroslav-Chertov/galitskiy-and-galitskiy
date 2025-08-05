import express from 'express';
import path from 'node:path';
import chalk from 'chalk';
import routes from './routes/webRoutes.js';
import 'dotenv/config';

const port = process.env.PORT || 3001;
process.env.URL = process.env.URL || 'http://localhost:' + port;
const app = express();


app.use('/favicon.ico', express.static(path.resolve('./public/assets/favicon/favicon.ico')));
app.use('/', [
    express.static(path.resolve(process.env.BUILD_FOLDER || './_build/assets')), 
    express.static(path.resolve('./public')), 
]);


// TODO: express-rate-limit
// app.use(cookieParser()); // Защита приложения (заголовки безопасности)
// app.use(helmet()); // Защита приложения (заголовки безопасности)
// app.use(cors());   // Разрешение кросс-доменных запросов
app.use(express.json()); // Парсинг JSON данных

app.use('/', routes);

// Обработка 404 ошибок для несуществующих маршрутов
app.use((req, res, next) => {
    return res.status(404).json({ message: 'MIDDLEWARE: Not Found 404' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('500 Error', err);
    return res.status(500).json({ message: 'MIDDLEWARE: Server Error 500', details: err });
});

app.listen(port, () => {
    console.log(`-------------------------------------`);
    console.log(`${chalk.bgHex('#325EE0')('CUSTOM SERVER:')} http://localhost:${port}`);
    console.log(`-------------------------------------`);
    process.send?.('started')
});
