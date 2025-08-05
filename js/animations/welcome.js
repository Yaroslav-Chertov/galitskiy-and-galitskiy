import { audioController } from '../app/AudioController.js';
import { Loader } from '../app/Loader.js';

class Welcome {
    constructor({ preloadData, onComplete, is404 }) {
        this.enabled = true;
        this.preloadData = preloadData;
        this.onComplete = onComplete;
        this.is404 = is404;

        this.DOM = {
            loadingBlock: null,
            noAccessBlock: null,
            yesBtn: null,
            noBtn: null,
            welcomeBlocks: null,
            loadingText: null,
            loadingLine: null,
        };

        this.state = {
            showLoading: false,
            showNoAccess: false,
        };

        this.init();
    }

    init = () => {
        this.DOM.loadingDebug = document.querySelector('.loading__debug');
        this.DOM.loadingBlock = document.querySelector('#preloader');
        this.DOM.noAccessBlock = document.querySelector('#no-access');
        this.DOM.yesBtn = document.querySelector('[data-action="yes"]');
        this.DOM.noBtn = document.querySelector('[data-action="no"]');
        this.DOM.welcomeBlocks = document.querySelectorAll('.welcome__block');
        this.DOM.loadingText = this.DOM.loadingBlock.querySelector('.loading__text span');
        this.DOM.loadingLine = this.DOM.loadingBlock.querySelector('.loading__line span');

        if (!this.DOM.loadingBlock || !this.DOM.noAccessBlock || !this.DOM.yesBtn || !this.DOM.noBtn || !this.DOM.welcomeBlocks.length || !this.DOM.loadingText || !this.DOM.loadingLine) {
            this.enabled = false;
            return;
        }

        this.DOM.yesBtn.addEventListener('click', () => {
            audioController.init();
            audioController.enableAndPlay();
            this.state.showLoading = true;
            this.state.showNoAccess = false;
            this.updateDisplay();
            this.startRealLoading();
        });

        this.DOM.noBtn.addEventListener('click', () => {
            this.state.showLoading = false;
            this.state.showNoAccess = true;
            this.updateDisplay();
        });

        const backBtn = this.DOM.noAccessBlock.querySelector('[data-action="back"]');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.state.showLoading = false;
                this.state.showNoAccess = false;
                this.updateDisplay();
            });
        }
    }

    updateDisplay = () => {
        this.DOM.welcomeBlocks.forEach((block) => {
            block.style.display = 'none';
        });

        this.DOM.loadingBlock.style.display = this.state.showLoading ? 'block' : 'none';
        this.DOM.noAccessBlock.style.display = this.state.showNoAccess ? 'block' : 'none';

        if (!this.state.showLoading && !this.state.showNoAccess) {
            const mainBlock = document.querySelector('#welcome');
            if (mainBlock) mainBlock.style.display = 'block';
        }
    };

    startRealLoading = async () => {
        await this.preloadData();
        const images = document.querySelectorAll('img[data-src]');
        const audioItems = Object.entries(audioController.sounds);

        const onComplete = () => {
            this.onComplete();
            document.body.classList.remove('is-loading');

            const welcomeBlock = document.querySelector('.welcome');
            if (welcomeBlock) welcomeBlock.style.display = 'none';
            if (this.DOM.loadingBlock) this.DOM.loadingBlock.style.display = 'none';
        };

        if (this.is404) {
            document.body.classList.add('is-404');
            return onComplete();
        }

        new Loader({
            images: images,
            audios: audioItems,
            onProgress: (percent, filesForLoading) => {
                // this.DOM.loadingDebug.innerHTML = filesForLoading.join(',<br/>')
                this.DOM.loadingText.textContent = `${percent}%`;
                this.DOM.loadingLine.style.width = `${percent}%`;
            },
            onComplete
        });
    };
}

export { Welcome };
