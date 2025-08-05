// CONTROLLERS
import { getPageComponent, render } from '#_/server/utils/jsx.js';


// Главная и все остальные страницы, для которых нет контроллера
const pageController = async (req, res, next) => {
    if (req.path.includes('.')) return next();

    const pageComponent = await getPageComponent('index');
    /* const data = await fetch('https://galitskiy-galitskiy.ru/local/ajax/data').then(r => r.json()).catch(() => {
        console.error('Ошибка получения данных');
        return false;
    }); */

    const data = (await import('#_/data.js').catch((e) => {
        console.error('Ошибка получения данных', e);
        return false;
    })).default;

    if (!pageComponent || !data) {
        return next();
    }

    try {
        const rendered = await render(pageComponent.default, { data });
        if (rendered === false) return next('Rendering error');

        return res.send(rendered);
    } catch (error) {
        console.log('Error on rendering page component', error);
        return next(error.message);
    }
}

export {
    pageController
};