import { match, pathToRegexp, compile, parse, stringify } from 'path-to-regexp';
import { parseDOMString } from '../utils/DomParser.js';
import Wine from '#_/components/Wine.jsx';
import copy from '../utils/copy.js';
import { dqs, dqsa } from '../utils/DOM.js';

export const matches = [
    match('/'),
    match('/about'),
    match('/wines'),
    match('/wines/:wine'),
]

class Router {
    constructor({ onUpdate, onRouterPopupClose }) {
        // TODO: закрывать попапы если переход на другую страницу
        this.onUpdate = onUpdate || (() => {});
        this.onRouterPopupClose = onRouterPopupClose || (() => {});

        this.detailPopup = dqs('.detail');
        this.blogPosts = dqsa('.blog-post');

        this.router = [
            {
                route: matches[0],
                conf: '/',
                elt: dqs('[data-route="main"]'),
                bodyClass: 'is-main',
                match: (params) => {
                    // console.log('match index', params);
                },
            },
            {
                route: matches[1],
                conf: '/about',
                elt: dqs('[data-route="about"]'),
                bodyClass: 'is-about',
                match: (params) => {
                    // console.log('match about', params);
                },
            },
            {
                route: matches[2],
                conf: '/wines',
                elt: dqs('[data-route="wines"]'),
                bodyClass: 'is-wines',
                match: (params) => {
                    // console.log('match wines', params);
                },
            },
            {
                route: matches[3],
                conf: '/wines/:wine',
                elt: dqs('[data-route="wine-details"]'),
                bodyClass: 'is-wine',
                match: (params) => {
                    // console.log('match wine', params);

                    /* const wineCode = params.wine;

                    const wineItem = data.wines.items.find(
                        (w) => w.code === wineCode
                    );

                    if (wineItem) {
                        this.currentWine = wineItem;
                        this.onUpdate({ wine: wineItem });
                    } else {
                        console.warn(`Вино "${wineCode}" не найдено`);
                    } */
                },
            },
        ];

        this.pages = {
            '/': {
                elt: dqs('[data-route="main"]'),
                bodyClass: 'is-main',
                onOpen: () => {},
                onClose: () => {},
            },
            '/about/': {
                elt: dqs('[data-route="about"]'),
                bodyClass: 'is-about',
                onOpen: () => {},
                onClose: () => {},
            },
            '/wines/': {
                elt: dqs('[data-route="wines"]'),
                bodyClass: 'is-wines',
                onOpen: () => {},
                onClose: () => {},
            },
            '/wines/:wine': {
                elt: dqs('[data-route="wine-details"]'),
                bodyClass: 'is-wine',
                onOpen: () => {},
                onClose: () => {},
            },
        };

        this.innerLinks = [];
        this.popupLinks = [];

        const route = this.normalizeRoute();
        this.status = this.openPage(route);
        if (this.status === 404) return; // не добавлять обработчики событий, если 404?

        this.addEvents();

        setTimeout(() => {
            this.openPopup(route);
        }, 100);
    }

    addEvents = () => {
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Escape' && this.popupOpened) {
                this.closeAllPopups();
            }
        });

        document.addEventListener('click', (e) => {
            if (this.popupOpened && !e.target.closest('.popup') && !e.target.closest('.detail') && !e.target.closest('.info')) {
                this.closeAllPopups();
            }

            const link = e.target.closest('a');

            if (link) {
                const href = link.getAttribute('href');

                if (link.dataset.copy) {
                    e.preventDefault();
                    copy(link.dataset.copy);
                } else {
                    dqs('#app').classList.remove('is-menu');

                    if (href) {
                        const isInner =
                            href.startsWith('/') &&
                            !href.includes('http') &&
                            !href.includes('#');

                        const isPopup = href.includes('#') && href.length > 1;

                        if (isInner) {
                            e.preventDefault();
                            this.closeAllPopups();
                            this.handleInnerLink(e, link)
                        }

                        if (isPopup) {
                            e.preventDefault();
                            this.closeAllPopups();
                            this.handlePopupLink(e, link)
                        }
                    }
                }
            }

            const closePopup = e.target.closest('.js-popup-close');
            if (closePopup) {
                e.preventDefault();

                this.closeAllPopups(e);
                history.replaceState(
                    {},
                    null,
                    location.origin + location.pathname
                );
            }
        });



        window.addEventListener('popstate', (event) => {
            this.openPage(this.normalizeRoute());
        });
    };

    handleInnerLink = (e, link) => {
        e.preventDefault();

        const href = link.getAttribute('href');
        const currentRoute = this.normalizeRoute();
        const targetRoute = this.normalizeRoute(href);

        if (currentRoute.pathname === targetRoute.pathname) return;

        history.pushState({}, null, targetRoute.pathname);

        this.openPage(targetRoute);

        return false;
    };

    handlePopupLink = (e, link) => {
        const href = link.getAttribute('href');
        this.openPopup(this.normalizeRoute(href));
    };

    openPopup = (route) => {
        if (!route.hash.length) return;

        this.closeAllPopups();

        const ids = route.hash;

        document.body.classList.add('is-popup');
        const popup = dqs(`.popup#${ids[0]}`);
        popup?.classList.add('is-active');
        this.popupOpened = true;

        if (popup.dataset.popupClass) {
            document.body.dataset.popup = popup.dataset.popupClass;
        }

        // Обрабатываем ссылки на блог отдельно
        if (ids[0] === 'blog' && ids[1]) {
            document.body.classList.add('is-detail');
            this.blogPosts.map(bp => {
                bp.classList.toggle('is-active', bp.dataset.detail === ids[1]);
            })

            const targetPopup = dqs(`#${ids[1]}`);
            const html = parseDOMString(targetPopup.innerHTML);
            const body = html.querySelectorAll('body > *');

            this.detailPopup.replaceChildren(...body);
            this.detailPopup.style.setProperty('display', `block`);

            setTimeout(() => {
                this.detailPopup.classList.add('is-active');
            }, 100);
        }

        history.pushState({}, null, location.origin + location.pathname + '#' + ids.join('/'));
        // this.onUpdate(null, route);
    };

    closeAllPopups = (e) => {
        e?.preventDefault();
        this.popupOpened = false;
        document.body.dataset.popup = '';
        dqs('.mobile-menu').classList.remove('is-open');
        document.body.classList.remove('is-menu');
        this.detailPopup.classList.remove('is-active');
        this.detailPopup.style.setProperty('display', `none`);
        document.body.classList.remove('is-popup', 'is-detail');
        const popup = dqsa(`.popup`);
        popup.forEach((p) => p.classList.remove('is-active'));
        this.blogPosts.map(bp => {
            bp.classList.remove('is-active');
        })
        this.onRouterPopupClose()
    };

    closeAllPages = () => {
        this.router.map((obj) => {
            document.body.classList.remove(obj.bodyClass);
            obj.elt.style.setProperty('display', `none`);
        });
    };

    openPage = (normalizedRoute) => {
        /* TODO: открытие #blog/zimnyaya-poezdka-fotografa-maksa-avdeeva-na-terruar-krasnaya-gorka */
        this.closeAllPages();

        let result = {
            assertedRoute: null,
            route: null,
        };

        const page = normalizedRoute.pathname;

        const assertedRoute = this.router.filter((r) => {
            const match = r.route(page);

            if (match) {
                result.assertedRoute = r;
                result.route = match;
            }

            return match;
        })?.[0];

        if (!assertedRoute) {
            return 404;
        }

        this.renderPage(assertedRoute, normalizedRoute);
        this.onUpdate(assertedRoute, normalizedRoute);
    };

    renderPage = (route, normalizedRoute) => {
        route.elt.style.setProperty('display', `block`);
        document.body.classList.add(route.bodyClass);

        if (normalizedRoute.page[0] === 'wines' && normalizedRoute.page[1]) {
            this.renderWine(normalizedRoute.page[1]);
        }
    };

    renderWine = (wineCode) => {
        const wineData = window.API_DATA.wines.items.find(w => w.code === wineCode);
        const component = Wine({ wine: wineData, similarWines: window.API_DATA.wines.items.filter(w => w.type === wineData.type && w.code !== wineData.code)});

        const renderTarget = dqs('[data-elt="wineDetailsRender"]');
        renderTarget.replaceChildren(...component);
    }

    normalizeRoute = (url) => {
        /*
            /about/#blog/galitskiy-i-galitskiy/
            /wines/grand-jet-blanc-de-blancs/
            /wines/sovinon-blan/2018/
            /wines/risling/2022/#buy
        */

        /*
            1. Страницы - index, about, wines
            2. Попап - #blog, #buy, #spaces, #contacts
        */

        const fullUrl = url || location.pathname + location.hash;
        const splitedUrl = fullUrl.split('#') || [];
        const page = splitedUrl[0]?.split('/').filter((r) => r);
        const hash = splitedUrl[1]?.split('/').filter((h) => h) || [];

        // if (!page.length) page.push('/');

        const result = {
            page,
            hash,
            pathname: '/' + page.join('/'),
        };

        return result;
    };
}

export default Router;
