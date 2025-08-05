const SVG_NS = 'http://www.w3.org/2000/svg';
const svgTags = [
    // Контейнеры
    'svg',
    'g',
    'defs',
    'symbol',
    'use',
    'marker',
    'mask',
    'pattern',
    'clipPath',

    // Геометрические фигуры
    'rect',
    'circle',
    'ellipse',
    'line',
    'polyline',
    'polygon',
    'path',

    // Градиенты и заливки
    'linearGradient',
    'radialGradient',
    'stop',

    // Текст
    'text',
    'tspan',
    'textPath',

    // Стили и фильтры
    'style',
    'filter',
    'feGaussianBlur',
    'feOffset',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feFlood',
    'feImage',
    'feMerge',
    'feMorphology',
    'feTurbulence',
    'feDisplacementMap',
    'feSpecularLighting',
    'feDiffuseLighting',
    'feDistantLight',
    'fePointLight',
    'feSpotLight',
    'feTile',
    'feConvolveMatrix',
    'feDropShadow',
    'feFuncR',
    'feFuncG',
    'feFuncB',
    'feFuncA',

    // Анимация
    'animate',
    'animateTransform',
    'animateMotion',
    'set',
    'mpath',
];

const _jsx = (tag, attributes, ...children) => {
    if (typeof tag === 'function') {
        return tag(attributes ?? {}, children);
    }

    let element;
    if (svgTags.includes(tag)) {
        element = document.createElementNS(SVG_NS, tag);
    } else {
        element = document.createElement(tag);
    }

    // Assign attributes:
    let map = attributes ?? {};
    let prop;

    for (prop of Object.keys(map)) {
        // Extract values:
        prop = prop.toString();
        const value = map[prop] === undefined ? '' : map[prop]; // to prevent undefined as props value
        const anyReference = element;

        if (svgTags.includes(tag)) {
            element.setAttribute(prop, value);
        } else {
            if (typeof anyReference[prop] === 'undefined') {
                // As a fallback, attempt to set an attribute:
                element.setAttribute(prop, value);
            } else {
                anyReference[prop] = value;
            }
        }
    }

    // append children
    for (let child of children) {
        if (element?.dataset?.innerhtml === 'true') {
            element.innerHTML = child;
            continue;
        }

        if (typeof child === 'string' || typeof child === 'number') {
            element.innerHTML += child;
            continue;
        }

        if (Array.isArray(child)) {
            element.append(...child);
            continue;
        }

        try {
            child && element?.appendChild(child);
        } catch (error) {
            console.error('Render error:', error);
            console.log('Error on element:', element, child);
        }
    }

    return element;
};

const _jsxFragment = (attributes, children) => {
    const result = children.filter((c) => c);
    return result.length === 1 ? result[0] : result;
};

// Add factory into window on import
if (!window._jsx) {
    window._jsx = _jsx;
    window._jsxFragment = _jsxFragment;
}

export { _jsx, _jsxFragment };
