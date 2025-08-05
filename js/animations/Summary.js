import { dqs } from '../utils/DOM.js';
import { normClamp } from '../utils/interpolate.js';
import { Animation } from './Animation.js';

class AnimateSummary extends Animation {
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
                header: dqs('#app .header'),
            };
        }

        this.attributes.indexTopStart = 365; //this.DOM.top.getBoundingClientRect().height;

        this.initialized = true;
    };

    update = () => {
        if (!this.initialized || !this.enabled) return;

        const scroll = this.params.scrollController.scroll;

        if (this.currentRoute === '/') {
            const vineyardsScrollProgress = this.params.scrollController.sectionBounds.vineyards.items[0].intersections.screenClamp;
            this.state.headerHeight = Math.min(this.attributes.headerHeight, this.height - this.height * vineyardsScrollProgress);
            this.state.stuckVineyards = this.state.headerHeight === 0;
        }
    };

    render = () => {
        if (!this.initialized || !this.enabled) return;

        this.needsUpdate('headerHeight', this.state.headerHeight) && this.DOM.header.style.setProperty('height', `${this.state.headerHeight}px`);
    };
}

export { AnimateSummary };
