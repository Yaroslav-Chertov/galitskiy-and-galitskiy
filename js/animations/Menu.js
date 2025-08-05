import { audioController } from '../app/AudioController.js';
import { dqs, dqsa } from '../utils/DOM.js';
import { clamp, normClamp } from '../utils/interpolate.js';
import { Animation } from './Animation.js';

class AnimateMenu extends Animation {
    constructor(params) {
        super(params);

        this.DOM = null;
        this.attributes = {
            indexTopStart: null,
            indexTopEnd: null,
            startHeaderScrollOffset: null,
            startHeaderScrollDistance: null,
            menuTopOffset: null,
        };

        this.state = {
            topProgress: null,
            top: null,
            headerHeight: null,
            menuOffsetX: null,
            menuMinOffsetX: null,
        };

        this.breakpointValues = {
            4000: {
                paddingTop: 140,
                fontSize: 120,
                targetFontSize: 18,
                distance: 245,
            },
            1680: {
                paddingTop: 90,
                fontSize: 120,
                targetFontSize: 18,
                distance: 200,
            },
            1440: {
                paddingTop: 125,
                fontSize: 85,
                targetFontSize: 18,
                distance: 200,
            },
            1024: {
                paddingTop: 140,
                fontSize: 85,
                targetFontSize: 54,
                distance: 180,
            },
            768: {
                paddingTop: 105,
                fontSize: 60,
                targetFontSize: 54,
                distance: 120,
            },
        };

        this.currentBreakPoint = null;
    }

    init = () => {
        if (!this.DOM) {
            this.DOM = {
                body: document.body,
                header: dqs('#app .header'),
                aboutContentHeader: dqs('[data-route="about"] .content-header'),
                winesContentHeader: dqs('[data-route="wines"] .content-header'),
                info: dqs('#app .header .info'),
                burger: dqs('#app .header .burger'),
                mobileMenu: dqs('#app .mobile-menu'),
                allBurgers: dqsa('#app .burger'),
                menu: dqs('#app .header .menu'),
                menuLeft: dqs('#app .header .menu-left'),
                menuRight: dqs('#app .header .menu-right'),
                menuLeftFS: dqs('#app .header .menu-left [data-elts="fontSize"]'),
                menuRightFS: dqs('#app .header .menu-right [data-elts="fontSize"]'),
                top: dqs('#top'),
                topTitle: dqs('.top-title'),
                logo: dqsa('#app .logo'),
                logoSvg: dqsa('#app .logo svg'),
                vineyards: dqs('[data-elts="vineyards"]'),
                panelHolderVineyards: dqs('[data-elts="panelHolder"][data-id="panel-vineyards"]'),
                panelHolderWines: dqs('[data-elts="panelHolder"][data-id="panel-wines"]'),
                winesContainer: dqs('[data-elts="wines"][data-step="wines"]'),
                panelHolderWinesList: dqs('[data-elts="winesPage"] [data-id="panel-wines"]'),
                panelHolderAbout: dqs('[data-id="panel-about-top"]'),
                aboutPanelOverlap: dqs('[data-id="panel-about-gallery"]'),
                aboutQuoteOverlap: dqs('[data-id="panel-about-quote"]'),
                aboutQuote: dqs('[data-elts="aboutQuote"]'),

                winesHeader: dqs('[data-elt="winesHeader"]'),
                winesPanelOverlap: dqs('[data-elt="panelOverlap"]'),

                aboutHeader: dqs('[data-elt="aboutHeader"]'),
                aboutPage: dqs('[data-route="about"]'),
                summaryHolder: dqs('#app .summary-holder'),
                summary: dqs('#app .summary'),
                fullPage: dqs('[data-page="root"]'),
            };

            this.RO = new ResizeObserver(this.onResizeRoot);
            this.RO.observe(this.DOM.fullPage);
        }

        this.DOM.wineContentHeader = dqs('[data-route="wine-details"] .content-gallery');

        this.attributes.indexTopStart = this.DOM.top.getBoundingClientRect().height;
        this.attributes.indexTopEnd = 0;
        this.attributes.startHeaderScrollOffset = 600;
        this.attributes.startHeaderScrollDistance = 600;
        this.attributes.menuTopOffset = 15;
        this.attributes.menuTopHeight = this.DOM.top.getBoundingClientRect().height;
        this.attributes.pageHeight = this.DOM.fullPage.getBoundingClientRect().height;
        this.attributes.summaryHeight = this.DOM.summary.getBoundingClientRect().height;

        if (this.currentRoute === '/') {
            this.attributes.headerHeight = this.attributes.indexTopStart * 2; //this.DOM.menu.getBoundingClientRect().height * 2;
        }

        if (this.currentRoute === '/about') {
            this.DOM.aboutContentHeader.classList.remove('is-hide');
            this.attributes.headerHeight = this.DOM.aboutContentHeader.getBoundingClientRect().height;
        }

        if (this.currentRoute === '/wines') {
            this.DOM.winesContentHeader.classList.remove('is-hide');
            this.attributes.headerHeight = this.DOM.winesContentHeader.getBoundingClientRect().height;
        }

        if (this.currentRoute === '/wines/:wine') {
            this.DOM.winesContentHeader.classList.remove('is-hide');
            this.attributes.headerHeight = this.DOM.wineContentHeader.getBoundingClientRect().height;
        }

        if (this.state.headerHidden) {
            this.DOM.winesContentHeader.classList.add('is-hide');
            this.DOM.aboutContentHeader.classList.add('is-hide');
        }

        this.attributes.mobMenuIndexOffset = this.DOM.topTitle.getBoundingClientRect().height;

        this.getBreakpoint(this.width);

        this.initialized = true;
    };

    enable = (route) => {
        this.currentRoute = route;
        this.init(this.params);
        this.enabled = true;
    };

    onResizeRoot = (entries) => {
        this.attributes.pageHeight = entries[0].contentRect.height;
        this.attributes.summaryHeight = this.DOM.summary.getBoundingClientRect().height;//Math.max(this.DOM.summary.getBoundingClientRect().height, this.height);
    }

    update = (enableTransition) => {
        if (!this.initialized || !this.enabled) return;

        const globalScroll = this.params.scrollController.scroll;
        this.state.mobMenuIndexOffset = 0;

        this.state.logoScale = null;

        if (this.currentRoute === '/') {
            const vwFromCSS = 8.3333333333;

            this.state.topProgress = normClamp(globalScroll, this.attributes.startHeaderScrollOffset, this.attributes.startHeaderScrollOffset + this.attributes.startHeaderScrollDistance); //clamp(this.attributes.indexTopStart - globalScroll - this.attributes.startHeaderScrollOffset);
            this.state.top = this.attributes.indexTopStart - (this.attributes.indexTopStart - this.attributes.menuTopOffset) * this.state.topProgress;
            this.state.logoTop = this.state.top;
            this.state.menuOffsetX = this.width / 2 - 70;
            this.state.menuMinOffsetX = (this.width / 100) * vwFromCSS;

            const vineyardsScrollProgress = this.params.scrollController.sectionBounds.vineyards.items[0].intersections.screenClamp;
            this.state.headerHeight = Math.min(this.attributes.headerHeight, this.height - this.height * vineyardsScrollProgress);
            this.state.stuckVineyards = this.state.headerHeight === 0;
            this.state.winesVisible = this.params.scrollController.sectionBounds.wines.items[0].intersections.inClamp === 1;
            this.state.showSummary = this.state.winesVisible;
            this.state.topOffset = this.attributes.indexTopStart * -this.state.topProgress;

            this.state.left = Math.min(-this.state.menuOffsetX + this.state.menuOffsetX * this.state.topProgress, -this.state.menuMinOffsetX);
            this.state.right = Math.max(this.state.menuOffsetX - this.state.menuOffsetX * this.state.topProgress, this.state.menuMinOffsetX);

            const headerMobProgress = normClamp(globalScroll, 0, this.attributes.menuTopHeight)
            if (this.width < 1024) {
                this.state.mobMenuIndexOffset = this.attributes.mobMenuIndexOffset - this.attributes.mobMenuIndexOffset * normClamp(globalScroll, 0, this.attributes.mobMenuIndexOffset);
                this.state.topOffset = -this.attributes.menuTopHeight * headerMobProgress;
                this.state.logoTop = Math.max(this.state.logoTop + this.state.topOffset - 40, 10);
                this.state.logoScale = 64 - 24 * headerMobProgress;
            }

            if (this.width < 768) {
                this.state.logoTop = this.attributes.menuTopHeight + 10 - this.attributes.menuTopHeight * headerMobProgress;
            }
        } else {
            if (this.width >= 1024) {
                this.state.mobMenuIndexOffset = 0;
            }
        }

        if (this.currentRoute === '/' || this.currentRoute === '/wines/:wine') {
            this.state.menuLeftFS = 0;
            this.state.menuRightFS = 0;
            this.state.menuTop = 0;
            this.state.headerPaddingTop = 0;
        }
        const headerHeightProgress = normClamp(globalScroll, 0, this.attributes.headerHeight);
        const headerWineAboutProgress = normClamp(globalScroll, 0, this.breakpointValues[this.currentBreakPoint].distance);
        this.state.mobMenuLeftOpacity = 1;
        this.state.mobMenuRightOpacity = 1;

        if (this.currentRoute === '/about') {
            const target = this.breakpointValues[this.currentBreakPoint].targetFontSize;
            const start = this.breakpointValues[this.currentBreakPoint].fontSize;
            this.state.menuLeftFS = start - (start - target) * headerWineAboutProgress;
            this.state.menuRightFS = target;
            this.state.aboutPanelHeaderOverlap = this.params.scrollController.sectionBounds.panelAboutGallery.items[0].intersections.inClamp >= 1;

            if (this.width < 768) {
                this.state.aboutPanelHeaderOverlap = this.params.scrollController.sectionBounds.panelAboutGallery.items[0].intersections.screenClamp >= 1;
            }

            this.state.aboutQuoteHeaderOverlap = this.params.scrollController.sectionBounds.aboutQuote.items[0].intersections.inClamp >= 1;
            const aboutQuote = this.params.scrollController.sectionBounds.aboutQuote.items[0];
            this.state.aboutSummaryHeaderOverlap = 1 - aboutQuote.intersections.outClamp < 80 / aboutQuote.bounds.height;

            this.state.aboutHeaderState = [this.state.aboutPanelHeaderOverlap, this.state.aboutQuoteHeaderOverlap, this.state.aboutSummaryHeaderOverlap].findLastIndex((i) => i === true);

            if (this.width < 1024) {
                this.state.mobMenuLeftOpacity = 1 - headerWineAboutProgress;
            }
        }

        if (this.currentRoute === '/wines') {
            const target = this.breakpointValues[this.currentBreakPoint].targetFontSize;
            const start = this.breakpointValues[this.currentBreakPoint].fontSize;
            this.state.menuLeftFS = target;
            this.state.menuRightFS = start - (start - target) * headerWineAboutProgress;

            const winesPage = this.params.scrollController.sectionBounds.winesPage.items[0];
            this.state.winesSummaryHeaderOverlap = 1 - winesPage.intersections.outClamp < 80 / winesPage.bounds.height;

            if (this.width < 1024) {
                this.state.mobMenuRightOpacity = 1 - headerWineAboutProgress;
            }
        }

        if (this.currentRoute === '/about' || this.currentRoute === '/wines') {
            this.state.headerHidden = headerHeightProgress === 1;
            const hh = this.attributes.headerHeight;
            this.state.headerHeight = hh - hh * headerHeightProgress;

            let pt = this.breakpointValues[this.currentBreakPoint].paddingTop;
            this.state.headerPaddingTop = pt - pt * headerWineAboutProgress;
            this.state.menuTop = 15;

            if (!enableTransition) {
                this.DOM.menuLeft.classList.add('notransition');
                this.DOM.menuRight.classList.add('notransition');

                clearTimeout(this.animationTM);
                this.animationTM = setTimeout(() => {
                    this.DOM.menuLeft.classList.remove('notransition');
                    this.DOM.menuRight.classList.remove('notransition');
                }, 50);
            }
        }

        this.state.summaryHeight = this.attributes.summaryHeight;
        const summary = this.params.scrollController.sectionBounds.summary.items[0];
        this.state.summaryVisible = summary.intersections.in > 0;
        this.state.summaryFullVisible = summary.intersections.screen >= 1;//summaryFullVisible >= 1;

        if (this.currentRoute !== '/wines/:wine') {
            audioController.playToggleSound('birds', this.state.summaryVisible);
        }

        if (this.currentRoute === '/wines/:wine') {
            this.state.headerHidden = headerHeightProgress === 1;
            const hh = this.attributes.headerHeight;
            this.state.headerHeight = hh - hh * headerHeightProgress;
            audioController.playToggleSound('birds', false);
        }
    };

    render = () => {
        if (!this.initialized || !this.enabled) return;

        this.needsUpdate('headerHeight', this.state.headerHeight) && this.DOM.header.style.setProperty('height', `${this.state.headerHeight}px`);

        if (this.needsUpdate('top', this.state.top)) {
            this.DOM.menu.style.setProperty('top', `${this.state.top}px`);
        }

        this.needsUpdate('logoTop', this.state.logoTop) && this.DOM.logo.map(l => l.style.setProperty('top', `${this.state.logoTop}px`));

        if (this.needsUpdate('logoScale', this.state.logoScale)) {
            this.DOM.logoSvg.map(l => {
                if (this.state.logoScale === null) {
                    l.style.removeProperty('width');
                    l.style.removeProperty('height');
                } else {
                    l.style.setProperty('width', `${this.state.logoScale}px`);
                    l.style.setProperty('height', `${this.state.logoScale}px`);
                }
            });
        }

        this.needsUpdate('topOffset', this.state.topOffset) && this.DOM.top.style.setProperty('top', `${this.state.topOffset}px`);
        this.needsUpdate('left',  this.state.left)  && this.DOM.menuLeft.style.setProperty('transform', `translateX(${this.state.left}px)`);
        this.needsUpdate('right', this.state.right) && this.DOM.menuRight.style.setProperty('transform', `translateX(${this.state.right}px)`);
        this.needsUpdate('stuckVineyards', !this.state.stuckVineyards) && this.DOM.panelHolderVineyards.classList.toggle('is-active', !this.state.stuckVineyards);

        if (this.needsUpdate('winesVisible', this.state.winesVisible)) {
            this.DOM.panelHolderVineyards.parentElement.classList.toggle('is-off-screen', this.state.winesVisible);
            this.DOM.panelHolderWines.classList.toggle('is-active', !this.state.winesVisible);
            this.DOM.winesContainer.dataset.state = this.state.winesVisible ? 'stuck' : '';
        }

        if (this.needsUpdate('showSummary', this.state.showSummary) && this.state.showSummary) {
            this.DOM.body.dataset.step = 'summary';
        }

        if (this.needsUpdate('menuLeft', this.state.headerPaddingTop)) {
            if (this.state.headerPaddingTop === 0 && this.currentRoute !== '/about') {
                this.DOM.menuLeft.style.removeProperty('padding-top');
            } else {
                this.DOM.menuLeft.style.setProperty('padding-top', `${this.state.headerPaddingTop}px`);
            }
        }

        if (this.needsUpdate('menuLeftFS', this.state.menuLeftFS)) {
            if (this.state.menuLeftFS === 0) {
                this.DOM.menuLeftFS.style.removeProperty('font-size');
            } else {
                this.DOM.menuLeftFS.style.setProperty('font-size', `${this.state.menuLeftFS}px`);
            }
        }

        if (this.needsUpdate('menuRight', this.state.headerPaddingTop)) {
            if (this.state.headerPaddingTop === 0 && this.currentRoute !== '/wines') {
                this.DOM.menuRight.style.removeProperty('padding-top');
            } else {
                this.DOM.menuRight.style.setProperty('padding-top', `${this.state.headerPaddingTop}px`);
            }
        }

        if (this.needsUpdate('menuRightFS', this.state.menuRightFS)) {
            if (this.state.menuRightFS === 0) {
                this.DOM.menuRightFS.style.removeProperty('font-size');
            } else {
                this.DOM.menuRightFS.style.setProperty('font-size', `${this.state.menuRightFS}px`);
            }
        }

        this.needsUpdate('headerAboutHidden', this.state.headerHidden) && this.DOM.panelHolderAbout.classList.toggle('is-active', !this.state.headerHidden);
        this.needsUpdate('aboutHeaderHide', this.state.headerHidden) && this.DOM.aboutHeader.classList.toggle('is-hide', this.state.headerHidden);

        this.needsUpdate('headerWineHidden', this.state.headerHidden) && this.DOM.panelHolderWinesList.classList.toggle('is-active', !this.state.headerHidden);
        this.needsUpdate('winesHeaderHide', this.state.headerHidden) && this.DOM.winesHeader.classList.toggle('is-hide', this.state.headerHidden);

        this.needsUpdate('winesSummaryOverlap', this.state.winesSummaryHeaderOverlap) && this.DOM.winesPanelOverlap.classList.toggle('is-to-bottom', this.state.winesSummaryHeaderOverlap);
        this.needsUpdate('aboutPanelOverlap', this.state.aboutPanelHeaderOverlap) && this.DOM.aboutPanelOverlap.classList.toggle('is-active', !this.state.aboutPanelHeaderOverlap);

        this.needsUpdate('aboutQuoteOverlap', this.state.aboutQuoteHeaderOverlap) && this.DOM.aboutQuoteOverlap.classList.toggle('is-active', !this.state.aboutQuoteHeaderOverlap);
        this.needsUpdate('aboutSummaryOverlap', this.state.aboutSummaryHeaderOverlap) && this.DOM.aboutQuote.classList.toggle('is-to-bottom', this.state.aboutSummaryHeaderOverlap);

        if (this.needsUpdate('aboutHeaderState', this.state.aboutHeaderState)) {
            this.DOM.aboutPage.dataset.state = this.state.aboutHeaderState;
        }

        if (this.needsUpdate('mobMenuIndexOffset', this.state.mobMenuIndexOffset)) {
            if (this.state.mobMenuIndexOffset === 0) {
                this.DOM.burger.style.removeProperty('transform');
                this.DOM.info.style.removeProperty('transform');
            } else {
                this.DOM.burger.style.setProperty('transform', `translateY(${this.state.mobMenuIndexOffset}px)`)
                this.DOM.info.style.setProperty('transform', `translateY(${this.state.mobMenuIndexOffset}px)`)
            }
        }

        if (this.needsUpdate('mobMenuLeftOpacity', this.state.mobMenuLeftOpacity)) {
            this.DOM.menuLeftFS.style.setProperty('opacity', this.state.mobMenuLeftOpacity);
        }

        if (this.needsUpdate('mobMenuRightOpacity', this.state.mobMenuRightOpacity)) {
            this.DOM.menuRightFS.style.setProperty('opacity', this.state.mobMenuRightOpacity);
        }

        this.needsUpdate('summaryVisible', this.state.summaryVisible) && this.DOM.summaryHolder.classList.toggle('is-ready', this.state.summaryVisible);
        this.needsUpdate('summaryFullVisible', this.state.summaryFullVisible) && this.DOM.summaryHolder.classList.toggle('is-visible', this.state.summaryFullVisible);
        this.needsUpdate('summaryHeight', this.state.summaryHeight) && this.DOM.summaryHolder.style.setProperty('height', `${this.state.summaryHeight}px`);
    };

    resize = (w, h) => {
        this.width = w;
        this.height = h;

        this.getBreakpoint(w);
        this.init();
    };

    getBreakpoint = (w) => {
        this.currentBreakPoint = Object.entries(this.breakpointValues).find(([key]) => {
            return +key > w;
        })?.[0];
    };
}

export { AnimateMenu };
