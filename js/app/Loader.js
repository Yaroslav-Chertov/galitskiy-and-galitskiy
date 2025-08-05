class Loader {
    constructor({ images = [], audios = [], onProgress, onComplete }) {
        this.total = images.length + audios.length;
        this.loaded = 0;
        this.onProgress = onProgress;
        this.onComplete = onComplete;
        this.filesForLoading = [];
        this.init(images, audios);
    }

    init = async (images, audios) => {
        this.loadImages(images);
        this.loadAudios(audios);
    };

    dataLoading = async (data) => {
        await data();
        this.handleFileLoad();
    };

    loadImages = (images) => {
        images.forEach((image) => {
            image.onload = () => this.handleFileLoad(image.dataset.src);
            image.onerror = () => this.handleFileLoad(image.dataset.src);
            image.src = image.dataset.src;
            this.filesForLoading.push(image.dataset.src);
        });
    };

    loadAudios = (audios) => {
        audios.map(([key, howl]) => {
            this.filesForLoading.push(howl._src);
            if (howl.state() === 'loaded') return this.handleFileLoad(howl._src);

            howl.once('load', this.handleFileLoad);
            howl.load();
        });
    };

    handleFileLoad = (path) => {
        const index = this.filesForLoading.findIndex(p => p === path);
        this.filesForLoading.splice(index, 1);
        this.loaded++;
        const percent = Math.floor((this.loaded / this.total) * 100);
        if (this.onProgress) this.onProgress(percent, this.filesForLoading);
        if (this.loaded >= this.total && this.onComplete) this.onComplete();
    };
}

export { Loader };
