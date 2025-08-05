import { dqs } from '../utils/DOM.js';
import { clamp, normClamp } from '../utils/interpolate.js';
import { Animation } from './Animation.js';

class AnimateWinesAbout extends Animation {
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
        this.DOM = {
            body: document.body,
            header: dqs('#app .header'),
            wineHead: dqs('[data-route="wine-details"] .content-gallery'),
            wineStuckHead: dqs('[data-id="panel-wine"]'),
        };

        this.attributes.stuckStart = this.DOM.wineHead.getBoundingClientRect().height;
        this.initialized = true;
    };

    update = () => {
        if (!this.initialized || !this.enabled) return;

        const globlaScroll = this.params.scrollController.scroll;
        this.state.stuckWineHeader = normClamp(globlaScroll, 0, this.attributes.stuckStart) >= 1;
    };

    render = () => {
        if (!this.initialized || !this.enabled) return;

        this.needsUpdate('headerStuck', this.state.stuckWineHeader) && this.DOM.wineStuckHead.classList.toggle('is-active', !this.state.stuckWineHeader);
    };

    resize = (w, h) => {
        this.width = w;
        this.height = h;

        this.init();
    }
}

export { AnimateWinesAbout };
