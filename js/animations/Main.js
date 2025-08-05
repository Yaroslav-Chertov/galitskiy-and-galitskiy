import { audioController } from '../app/AudioController.js';
import { dqs, dqsa } from '../utils/DOM.js';
import { normClamp } from '../utils/interpolate.js';
import { Animation } from './Animation.js';

class AnimateMain extends Animation {
    constructor(params) {
        super(params);

        this.DOM = null;
        this.attributes = {
            indexTopStart: null,
        };

        this.state = {
            topProgress: null,
        };
    }

    init = () => {
        if (!this.DOM) {
            this.DOM = {
                body: document.body,
                mainBlur: dqs('.main-about'),
                startSection: dqs('.step.step--start'),
                navigation: dqs('.step.step--navigation'),
                terruars: dqsa('[data-elts="terruars"]'),
                terruarsTop: dqsa('[data-elts="terruars"] .terruar-top'),
                terruarsSmall: dqsa('[data-elts="terruars"] .terruar-small'),
                vineyardsTitleStatic: dqs('.vineyards-title.--static'),
                vineyardsTitleFixed: dqs('.vineyards-title.--fixed'),
                vineyardsMenuContainer: dqs('.vineyards-menu'),
                vineyardsMapSwitcher: dqsa('[data-vineyards-id]'),
                vineyardsMapItems: dqsa('.vineyards-map-area'),
                winesBack: dqs('.wines-back .back'),
            };

            this.DOM.vineyardsMapSwitcher.map((sw) => {
                sw.addEventListener('mouseenter', () => {
                    if (this.width < 1024) return;

                    this.state.currentMapID = this.DOM.vineyardsMapItems.find((m) => m.id === sw.dataset.vineyardsId)?.id;
                });

                sw.addEventListener('mouseleave', () => {
                    if (this.width < 1024) return;

                    this.state.currentMapID = null;
                });
            });
        }

        this.attributes.scrollStartNorm = this.width < 1024 ? 0.4 : 0.6;
        this.attributes.showStep0Norm = 0.8;
        this.attributes.scrollEndNorm = 1;
        this.attributes.navigationShowNorm = 0.5;
        this.attributes.startSectionHeight = this.getStartSectionHeight();
        this.attributes.terruarSmallHeight = this.DOM.terruarsSmall[0].getBoundingClientRect().width * 1.3043478260869565; // пропорции изображения
        this.attributes.terruarHeight = this.height;
        
        this.initialized = true;
    };

    getStartSectionHeight = () => {
        let height = this.width * (373 / 192); // пропорции изображения
        if (this.width < 768) {
            height = this.width * (1271 / 375);
        }

        return height;
    };

    update = () => {
        if (!this.initialized || !this.enabled) return;

        const scroll = this.params.scrollController.scroll;

        const startScrollProgress = this.params.scrollController.sectionBounds.startScroll.items[0];
        this.state.step0 = scroll > this.attributes.startSectionHeight * this.attributes.scrollStartNorm;
        this.state.step1 = scroll > this.attributes.startSectionHeight - this.height;
        this.state.blurOpacity = normClamp(startScrollProgress.intersections.inFullClamp, this.attributes.scrollStartNorm, this.attributes.scrollEndNorm);

        const navigationProgress = this.params.scrollController.sectionBounds.navigation.items[0].intersections.inClamp;
        this.state.navigationAnimate = navigationProgress > this.attributes.navigationShowNorm;
        this.state.navigationStuck = navigationProgress >= 1;

        const halfScreen = this.height / 2;
        this.state.terruarsProgress = this.params.scrollController.sectionBounds.terruars.items.map((t) => {
            const p = t.intersections.inClamp;
            return {
                progress: p,
                topHeight: this.width < 1024 ? halfScreen : halfScreen * p,
                smallHeight: this.attributes.terruarSmallHeight * p,
            };
        });

        this.state.terruarHeight = this.attributes.terruarHeight;

        const vineyardsScrollProgress = this.params.scrollController.sectionBounds.vineyards.items[0].intersections.screenClamp;
        this.state.step3 = vineyardsScrollProgress > 0.5;

        const vineyardsTitleFixed = this.DOM.vineyardsTitleFixed.getBoundingClientRect().top;
        const vineyardsTitleStatic = this.DOM.vineyardsTitleStatic.getBoundingClientRect().top;
        this.state.vineyardsTitleStuck = vineyardsTitleStatic < vineyardsTitleFixed;

        this.state.winesBackOffset = this.params.scrollController.sectionBounds.wines.items[0].intersections.inOutClamp * 100;

        let currentSoundIndex = this.params.scrollController.sectionBounds.terruars.items.findLastIndex((terruar, i) => {
            return terruar.intersections.screen > 0;
        });

        const soundsMap = [
            'forest',
            'fauna',
            'ground',
            'sea',
            'climat',
        ];

        if (this.params.scrollController.sectionBounds.vineyards.items[0].intersections.screenClamp > 0) {
            currentSoundIndex = -1;
        }

        soundsMap.map((s, i) => audioController.playToggleSound(s, i === currentSoundIndex));
    };

    render = () => {
        if (!this.initialized || !this.enabled) return;

        this.needsUpdate('blurOpacity', this.state.blurOpacity) && this.DOM.mainBlur.style.setProperty('opacity', this.state.blurOpacity);
        this.needsUpdate('step0', this.state.step0) && this.DOM.body.classList.toggle('step-0', this.state.step0);
        if (this.needsUpdate('step1', this.state.step1)) {
            this.DOM.body.classList.toggle('step-1', this.state.step1);
            this.DOM.body.dataset.step = this.state.step1 ? 'navigation' : 'start';
        }
        this.needsUpdate('startHeight', this.attributes.startSectionHeight) && this.DOM.startSection.style.setProperty('height', `${this.attributes.startSectionHeight}px`);
        this.needsUpdate('animateNavigation', this.state.navigationAnimate) && this.DOM.navigation.classList.toggle('is-animate', this.state.navigationAnimate);

        if (this.needsUpdate('navigationStuck', this.state.navigationStuck)) {
            this.DOM.navigation.dataset.state = this.state.navigationStuck ? 'stuck' : '';
            this.DOM.body.classList.toggle('step-2', this.state.navigationStuck);
        }

        this.state.terruarsProgress?.map((tp, i) => {
            const top = tp.topHeight;
            const small = tp.smallHeight;
            const showAnimatic = tp.progress > 0.5;

            this.needsUpdate('terruar' + i, showAnimatic) && this.DOM.terruars[i].classList.toggle('is-animate', showAnimatic);
            this.needsUpdate('terrTop' + i, top) && this.DOM.terruarsTop[i].style.setProperty('height', `${top}px`);
            this.needsUpdate('terrSmall' + i, small) && this.DOM.terruarsSmall[i].style.setProperty('height', `${small}px`);
        });
        
        this.needsUpdate('terruarHeight', this.state.terruarHeight) && this.DOM.terruars.map(t => t.style.setProperty('height', this.state.terruarHeight + 'px'))

        this.needsUpdate('step3', this.state.step3) && this.DOM.body.classList.toggle('step-3', this.state.step3);

        if (this.needsUpdate('vineyardsTitleStuck', this.state.vineyardsTitleStuck)) {
            this.DOM.vineyardsTitleStatic.style.setProperty('visibility', this.state.vineyardsTitleStuck ? 'visible' : 'hidden');
            this.DOM.vineyardsTitleFixed.style.setProperty('visibility', this.state.vineyardsTitleStuck ? 'hidden' : 'visible');
            this.DOM.vineyardsMenuContainer.classList.toggle('is-active', this.state.vineyardsTitleStuck);
        }

        if (this.needsUpdate('currentMapID', this.state.currentMapID)) {
            this.DOM.vineyardsMapItems.map((m) => {
                m.classList.toggle('is-active', m.id === this.state.currentMapID);
            });

            if (this.state.currentMapID !== null) {
                this.DOM.body.classList.add('body--menu-vineyards');
                this.DOM.body.classList.add('body--vineyards');
            } else {
                clearTimeout(this.vineyardsTM);
                this.vineyardsTM = setTimeout(() => {
                    this.DOM.body.classList.remove('body--menu-vineyards');
                    this.DOM.body.classList.remove('body--vineyards');
                }, 200);
            }
        }

        this.needsUpdate('winesBackOffset', this.state.winesBackOffset) && this.DOM.winesBack.style.setProperty('background-position', `center ${this.state.winesBackOffset}%`);
    };

    resize = (w, h) => {
        this.width = w;
        this.height = h;

        this.init();
    };
}

export { AnimateMain };
