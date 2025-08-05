import DOMFactory, { dqsa } from './utils/DOM.js';
import ScrollController from './app/ScrollController.js';
import { Welcome } from './animations/Welcome.js';
import { AnimateWinesAbout } from './animations/WinesAbout.js';
import { initFilterWines } from './app/filterWines.js';
import Router, { matches } from './app/Router.js';
import Tabs from './app/Tabs.js';
import { initAboutSwipers, initWineDetailsSwiper } from './app/Swiper.js';
import Common from '../components/Common.jsx';
import { audioController } from './app/AudioController.js';
import { AnimateMenu } from './animations/Menu.js';
import { AnimateMain } from './animations/Main.js';
import Popup from './app/Popup.js';

const createPages = async () => {
    window.API_DATA = location.hostname === 'galitskiy-galitskiy.ru' ? await fetch('https://galitskiy-galitskiy.ru/local/ajax/data/') : await fetch('/data.json');
    window.API_DATA = await window.API_DATA.json();

    const commonComp = Common({ data: window.API_DATA });
    const comp = Array.isArray(commonComp) ? commonComp : [commonComp];

    document.documentElement.dataset.season = window.API_DATA.weather.SEASON_CODE;
    document.documentElement.dataset.weather = window.API_DATA.weather.CLASS;

    document.body.appendChild(...comp);
};

const setVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`); // высота без учета адресной строки на айфоне
};

class App {
    constructor() {
        setVH();
        const matched = matches.findIndex((m) => m(location.pathname));

        this.welcome = new Welcome({
            is404: matched === -1,
            preloadData: async () => {
                await createPages();
            },
            onComplete: () => {
                this.init();
            },
        });
    }

    init = async () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.navOpened = false;

        this.DOM = DOMFactory();
        audioController.init();

        this.scrollController = new ScrollController({
            scrollTarget: document.querySelector('#holder'),
            sections: {
                // определяем секцию как vineyards === data-elts="vineyards"
                // все отслеживаемые с таким аттрибутом будут в scrollController.sectionBounds.vineyards
                scroll: { watch: true },

                startScroll: { watch: true },
                navigation: { watch: true },
                terruars: { watch: true },
                vineyards: { watch: true },

                wines: { watch: true },
                summary: { watch: true },
                winesPage: { watch: true },
                panelAboutGallery: { watch: true },
                aboutQuote: { watch: true },
                wine: { watch: true },
            },
        });

        this.tabs = new Tabs();
        this.popups = new Popup({
            onPopupOpen: (id, popupElt, options, control) => {
                if (id === 'lg' || id === 'vb' || id === 'sk' || id === 'dj') {
                    this.vineyardsOpenedPopupID = id;
                    this.vineyardsOpenedPopup = popupElt;
                    const fakeTitle = popupElt.querySelector('.vineyards-popup-fake-title');
                    this.titleYOffset = control?.getBoundingClientRect().top - window.scrollY - 120;
                    fakeTitle.style.setProperty('transform', `translateY(${this.titleYOffset}px)`);
                    fakeTitle.style.setProperty('display', `block`);
                    fakeTitle.style.removeProperty('transition');

                    setTimeout(() => {
                        fakeTitle.style.setProperty('transform', `translateY(${0}px)`);
                        fakeTitle.style.setProperty('transition', `transform 0.5s`);
                    }, 50);

                    this.fakeTM = setTimeout(() => {
                        fakeTitle.style.setProperty('display', `none`);
                    }, 800);
                }

                if (id === 'nav') {
                    document.body.classList.add('is-menu');
                }
            },
            onPopupClose: (name) => {
                const id = this.vineyardsOpenedPopupID;
                if (id === 'lg' || id === 'vb' || id === 'sk' || id === 'dj') {
                    clearTimeout(this.fakeTM);
                    const fakeTitle = this.vineyardsOpenedPopup.querySelector('.vineyards-popup-fake-title');
                    fakeTitle.style.setProperty('display', `block`);
                    setTimeout(() => {
                        fakeTitle.style.setProperty('transform', `translateY(${this.titleYOffset}px)`);
                        fakeTitle.style.setProperty('transition', `transform 0.5s`);
                    }, 5);
                    this.vineyardsOpenedPopup = null;
                }

                document.body.classList.remove('is-menu');
                this.navOpened = false;
            },
        });

        // Layout.init(); //WARN: временно отключаем
        this.animations = [
            new AnimateMenu({
                scrollController: this.scrollController,
                enabledRoutes: ['*'],
            }),
            new AnimateMain({
                scrollController: this.scrollController,
                enabledRoutes: ['/'],
            }),
            new AnimateWinesAbout({
                scrollController: this.scrollController,
                enabledRoutes: ['/wines', '/wines/:wine'],
            }),
        ];

        this.router = new Router({
            onRouterPopupClose: () => {
                this.navOpened = false;
            },
            // Вызывается после изменения страницы
            onUpdate: (name, normalizedRoute) => {
                document.body.classList.remove('is-404');
                document.querySelector('[data-elt="wineLanding"]')?.classList.remove('is-active');

                switch (name?.conf) {
                    case '/':
                        break;

                    case '/about':
                    case '/about/':
                        initAboutSwipers();
                        break;

                    case '/wines':
                    case '/wines/':
                        break;

                    case '/wines/:wine':
                        initWineDetailsSwiper();

                        if (normalizedRoute.page?.[1].includes('grand-jet')) {
                            document.querySelector('[data-elt="wineLanding"]').classList.add('is-active');
                        }
                        break;
                }

                this.animations.map((a) => {
                    a.disable();
                });

                document.querySelector('#holder').scrollTo({ top: 0, behavior: 'instant' });

                setTimeout(() => {
                    this.width = window.innerWidth;
                    this.height = window.innerHeight;
                    this.scrollController.onResize();
                    this.animations.map((a) => {
                        a.autoToggle(name.conf);
                        a.resize?.(this.width, this.height);
                    });

                    this.scrollController.onScroll();
                    this.update(true);
                }, 50);
            },
        });

        initFilterWines();

        this.loop(0);
        this.lastTime = 0;
        this.addEvents();
        this.handleScrollEvent(); // чтобы вызвать нужные методы для обновления начального состояния
    };

    addEvents = () => {
        window.addEventListener('load', (e) => {
            this.scrollController.onLoad(e);
        });

        window.addEventListener('resize', (e) => {
            setVH();
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.scrollController.onResize(e);
            this.animations.map((an) => {
                an.resize?.(this.width, this.height);
                an.update?.(this.scrollController);
                an.render?.();
            });
        });

        this.DOM.holder.addEventListener('scroll', this.handleScrollEvent);

        document.querySelectorAll('.burger').forEach((b) =>
            b.addEventListener('click', () => {
                this.navOpened = !this.navOpened;
                document.body.classList.toggle('is-menu', this.navOpened);
                document.querySelector('.mobile-menu').classList.toggle('is-open', this.navOpened);
            })
        );

        document.addEventListener('click', (e) => {
            const wineBottle = e.target.closest('.wine-bottle');

            if (wineBottle) {
                const images = dqsa('.wine-image');
                const allBottles = dqsa('.wine-bottle');
                images.map((img, i) => {
                    img.classList.toggle('is-active', i === +wineBottle.dataset.id);
                    allBottles[i].classList.toggle('is-active', i === +wineBottle.dataset.id);
                });
            }
        });
    };

    handleScrollEvent = () => {
        this.scrollController.onScroll();
        this.update();
    };

    loop = (time) => {
        requestAnimationFrame(this.loop);
        const delta = time - this.lastTime;
        this.render(delta);
        this.lastTime = time;
    };

    update = (enableTransition) => {
        // Здесь считаем состояние, калькулируем и тд
        this.animations.map((animationClass) => animationClass.update(enableTransition));
    };

    render = (delta) => {
        // Здесь меняем стили
        this.animations.map((animationClass) => animationClass.render(delta));
    };
}

window.addEventListener('DOMContentLoaded', async () => {
    new App();
});
