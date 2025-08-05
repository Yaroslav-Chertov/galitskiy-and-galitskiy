import { dqsa } from '../utils/DOM.js';

const initFilterWines = () => {
    const filterLabels = document.querySelectorAll('.filter label');
    const inputs = dqsa('.filter input');
    const wines = document.querySelectorAll('.catalog-item');


    filterLabels.forEach((label) => {
        const input = label.querySelector('input');
        input.addEventListener('change', () => {
            // Переключаем
            filterLabels.forEach((l) => l.classList.remove('is-active'));
            label.classList.add('is-active');

            const selectedType = input.value;

            // Фильтруем
            wines.forEach((wine) => {
                const wineType = wine.dataset.type;
                const isVisible = !selectedType || wineType === selectedType;
                wine.classList.toggle('is-hidden', !isVisible);
            });
        });
    });

    const filterLinks = dqsa('[data-elts="setFilter"]').map(el => {
        el.addEventListener('click', () => {
             inputs.find(input => input.value === el.dataset.value && input.click());
        })
    })
}

export { initFilterWines };