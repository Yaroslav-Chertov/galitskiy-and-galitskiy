/*
v1.0.1

new ScrollController();

* Инициализируем с секциями. Если секции уже есть, инициализация затирает существующий экземпляр и тд
* Вешаем события загрузки, скролла, ресайза в ядре
* Если ДОМ изменился - инициализируем заново или сделать метод обновления ДОМ без повторной инициализации?
* При события передаем данные и калькулируем позиции элементов

* 1. Метод - Получить список секций - обращение к ДОМ, редко должно срабатывать
* 2. Метод - Обойти все секции и вычислить все значения
*/

let instance;

export default class ScrollController {
    constructor(options = {}) {
        if (instance) return instance;
        else {
            instance = this;
        }

        this.options = {
            callback: () => {},
            ...options,
            sections: {
                scroll: {
                    watch: true,
                },
                ...options.sections,
            },
            events: {
                load: false,
                scroll: false,
                resize: false,
                ...(options.events || {}),
            },
        };

        this.height = options.height || window.innerHeight;
        this.scrollTarget = (() => options.scrollTarget.scrollTop) || (() => window.scrollY);
        this.scrollSections = {};
        this.sectionBounds = {};
        this.updateSectionsList();

        this.init();
        this.addEvents();
    }

    init = () => {
        this.updateScroll();
        this.updateSectionBounds();
    };

    addEvents = () => {
        this.options.events.load &&
            window.addEventListener('load', this.onLoad);
        this.options.events.scroll &&
            window.addEventListener('scroll', this.onScroll, { passive: true });
        this.options.events.resize &&
            window.addEventListener('resize', this.onResize);
    };

    onLoad = (e) => {
        this.updateScroll();
        this.onResize();
        this.updateSectionBounds();
    };

    onScroll = () => {
        this.updateScroll();
        this.updateSectionBounds();
    };

    onResize = () => {
        this.height = window.innerHeight;
        this.updateSectionBounds();
    };

    updateScroll = () => {
        this.scroll = this.scrollTarget();//scrollY;
    };

    updateSectionsList = (updatedSectionsConfig, refresh) => {
        if (refresh || !this.scrollSections) {
            this.scrollSections = {};
        }

        Object.entries(updatedSectionsConfig || this.options.sections).map(
            ([selector, params]) => {
                const targetSections = [
                    document.querySelector(`[data-elt~="${selector}"]`),
                    ...document.querySelectorAll(`[data-elts~="${selector}"]`),
                ].filter((s) => s);
                if (!targetSections.length) return;

                this.scrollSections[selector] = {
                    sectionNodes: targetSections,
                    params,
                };
            }
        );

        this.sectionBounds = {
            ...this.scrollSections,
        };

        return this.scrollSections;
    };

    getNodeBounds = (node, i) => {
        const bcr = node.getBoundingClientRect();

        const bounds = {
            top: bcr.top - this.height + this.scroll,
            bottom: bcr.top + this.height,
            height: bcr.height,
        };

        return {
            node,
            index: i,
            dataset: { ...node.dataset },
            bounds,
            intersections: this.intersections(bounds),
        };
    };

    intersections = (bounds) => {
        // TODO: считать только по запросу?
        const intersections = {};
        intersections.in = (bounds.top - this.scroll) / -bounds.height;
        intersections.inClamp = Math.max(0, Math.min(1, intersections.in));

        // Появление элемента снизу 0 - 1 до тех пор, пока он не начнет уезжать
        // FIXME: infinity
        intersections.inFull =
            (bounds.top - this.scroll + this.height) /
            (-bounds.height + this.height);
        intersections.inFullClamp = Math.max(
            0,
            Math.min(1, intersections.inFull)
        );

        // исчезновение элемента сверху 0 - 1
        intersections.out =
            (bounds.top - this.scroll + this.height) / -bounds.height;
        intersections.outClamp = Math.max(0, Math.min(1, intersections.out));

        // появление элемента снизу 0 и исчезновение до косания верхней границы элемента верхнего края браузера 1
        intersections.inOut =
            (bounds.top - this.scroll) / -(this.height + bounds.height);
        intersections.inOutClamp = Math.max(
            0,
            Math.min(1, intersections.inOut)
        );

        // появление снизу 0 и касание верхней частью элемента края браузера 1
        intersections.screen = (bounds.top - this.scroll) / -this.height;
        intersections.screenClamp = Math.max(
            0,
            Math.min(1, intersections.screen)
        );

        return intersections;
    };

    updateSectionBounds = () => {
        Object.entries(this.sectionBounds).map(
            ([selector, items], sectionIndex) => {
                if (this.sectionBounds[selector].params.watch === false) return;

                this.sectionBounds[selector].items = this.sectionBounds[
                    selector
                ].sectionNodes.map((elt, i) => this.getNodeBounds(elt, i));
            }
        );
    };
}
