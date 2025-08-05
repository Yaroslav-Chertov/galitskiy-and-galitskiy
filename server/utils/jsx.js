import { injectLivereloader } from '#_/.dev/render.js';

const loadPageComponent = async (filePath, reload) => {
    let pageComponent = false;

    console.time('getPageComponent ' + filePath);
    try {
        const reloadImport = process.env.NODE_ENV === 'development' || reload ? '?reload' : '';
        const importPath = `#_/pages/${filePath}.jsx${reloadImport}`;
        pageComponent = (await import(importPath));
    } catch (error) {
        if (error.message.includes('Cannot find module')) return;

        console.log('Error in imported component', error.message);
        return false;
    } finally {
        console.timeEnd('getPageComponent ' + filePath);
    }

    return pageComponent;
}

const getPageComponent = async (filePath, reload) => {
    let pageComponent;

    if (Array.isArray(filePath)) {
        for await (const fp of filePath) {
            pageComponent = await loadPageComponent(fp, reload);

            if (pageComponent) {
                break;
            }
        }
    } else {
        pageComponent = await loadPageComponent(filePath, reload);
    }

    return pageComponent;
}

const render = async (jsxComponent, data) => {
    console.time('Rendering');
    let rendered = await jsxComponent(data);
        rendered = injectLivereloader(rendered);
    console.timeEnd('Rendering');

    return rendered;
}

export {
    getPageComponent,
    render
}