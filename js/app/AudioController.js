import { Howler, Howl } from 'howler';

class AudioController {
    constructor() {
        this.cache = {};

        this.sounds = {
            main: new Howl({
                src: ['/assets/audio/main.mp3'],
                loop: true,
                volume: 0.4,
                preload: true,
            }),
            forest: new Howl({
                src: ['/assets/audio/forest.mp3'],
                loop: true,
                volume: 0.5,
                preload: false,
            }),
            fauna: new Howl({
                src: ['/assets/audio/fauna.mp3'],
                loop: true,
                volume: 0.5,
                preload: false,
            }),
            ground: new Howl({
                src: ['/assets/audio/ground.mp3'],
                loop: true,
                volume: 0.5,
                preload: false,
            }),
            sea: new Howl({
                src: ['/assets/audio/sea.mp3'],
                loop: true,
                volume: 0.5,
                preload: false,
            }),
            climat: new Howl({
                src: ['/assets/audio/climat.mp3'],
                loop: true,
                volume: 0.5,
                preload: false,
            }),

            birds: new Howl({
                src: ['/assets/audio/birds.mp3'],
                loop: true,
                volume: 0.5,
                preload: false,
            }),
        };

        this.isEnabled = false;
        this.isMuted = false;
        this.wasManuallyMuted = false;
        this.wasPausedByTab = false;
        this.isManuallyPaused = false;
        this.terrarsPlaying = new Set();

        this.initialized = false;
    }

    needsUpdate = (key, value) => {
        if (this.cache[key] === value) return false;

        this.cache[key] = value;

        return true;
    };

    init = () => {
        document.addEventListener('visibilitychange', () => {
            if (!this.isEnabled || !this.initialized) return;

            if (document.hidden) {
                Howler.volume(0);
                this.wasPausedByTab = true;
            } else {
                if (this.wasPausedByTab && !this.wasManuallyMuted) {
                    Howler.volume(1);
                    this.wasPausedByTab = false;
                }
            }
        });

        document.querySelectorAll('.sound').forEach((el) => {
            el.addEventListener('click', () => this.toggleUserMute());
        });

        this.initialized = true;
    };

    enableAndPlay = () => {
        this.isEnabled = true;
        this.playToggleSound('main', true);
    };

    mute = (state) => {
        Howler.volume(state ? 0 : 1);
        document.body.dataset.music = state ? 'paused' : 'play';
        this.wasManuallyMuted = state;
    };

    toggleUserMute = () => {
        this.isMuted = !this.isMuted;
        this.mute(this.isMuted);
    };

    playToggleSound = (name, state) => {
        if (!this.isEnabled) return;
        if (this.needsUpdate(name, state)) {
            this.sounds[name][state ? 'play' : 'pause']();
        }
    }
}

export const audioController = new AudioController();
