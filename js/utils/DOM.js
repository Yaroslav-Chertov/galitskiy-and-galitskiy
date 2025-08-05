
let instance;


/*
Для массива или одного элемента всегда используется селектор data-elt
const DOMFactory = (update) => {
    if (!update && instance) return instance;
    const DOM = {};

    [...document.querySelectorAll('[data-elt]')].map((elt, i) => {
        let arr = elt.dataset.elt.split(' ');

        arr.forEach(function(item, index, array) {
            if (DOM[item]) {
                DOM[item].push(elt);
            } else {
                DOM[item] = [elt];
        }
        });
        });

    Object.entries(DOM).map(([key, elts], i) => {
        if (elts.length > 1) return;

        DOM[key] = elts[0]; // вместо массива оставляем единственный элемент
    });

    instance = DOM;

    return DOM;
    } */

// Для массива селектор data-elts, для одного элемента всегда data-elt
const DOMFactory = (options) => {
    let update = false;
    let one = '[data-elt]';
    let multiple = '[data-elts]';

    if (typeof options === 'boolean') {
        update = options;
    }

    if (Array.isArray(options)) {
        one = options[0];
        multiple = options[1];
    }

    if (!update && instance) return instance;
    const DOM = {};

    DOM.body = document.body;

    [...document.querySelectorAll(multiple)].forEach((elt, i) => {
        let arr = elt.dataset.elts.split(' ');

        arr.map((item) => {
            if (DOM[item]) {
                DOM[item].push(elt);
            } else {
                DOM[item] = [elt];
            }
        });
    });

    [...document.querySelectorAll(one)].forEach((elt, i) => {
        let arr = elt.dataset.elt.split(' ');

        arr.map((item) => {
            DOM[item] = elt;
        });
    });

    instance = DOM;

    return DOM;
}

const dqs = (selector) => document.querySelector(selector);
const dqsa = (selector) => [...document.querySelectorAll(selector)];
const qs = (scope, selector) => scope.querySelector(selector);
const qsa = (scope, selector) => [...scope.querySelectorAll(selector)];

export default DOMFactory;
export {
    DOMFactory,
    dqs,
    dqsa,
    qs,
    qsa
};