import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

let aboutSwipersInited = false;

export const initAboutSwipers = () => {
    if (aboutSwipersInited) return;

    requestAnimationFrame(() => {
        const timelineEl = document.querySelector('.about-timeline');
        const galleryEl = document.querySelector('.about-slides');

        if (!timelineEl || !galleryEl) {
            console.warn('Swiper containers not found');
            return;
        }

        const timelineSwiper = new Swiper('.about-timeline', {
            modules: [Navigation],
            centeredSlides: window.innerWidth >= 768,
            slidesPerView: 'auto',
            // slidesPerView: 1,
            navigation: {
                nextEl: '.about-timeline .swiper-button-next',
                prevEl: '.about-timeline .swiper-button-prev',
            },
            loop: false,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
        });

        const gallerySwiper = new Swiper('.about-slides', {
            slidesPerView: 1,
            modules: [Navigation],
            navigation: {
                nextEl: '.about-slides .swiper-button-next',
                prevEl: '.about-slides .swiper-button-prev',
            },
            loop: false,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            on: {
                slideChange(swiper) {
                    const activeIndex = swiper.activeIndex;
                    const total = swiper.slides.length;

                    const info = document.querySelector('.js-about-slide__info');
                    const text = document.querySelector('.js-about-slide__text');

                    if (info) {
                        info.innerHTML = `<span>${activeIndex + 1} / ${total}</span>`;
                    }

                    const textBlocks = document.querySelectorAll('.about-slide__text');
                    if (text && textBlocks[activeIndex]) {
                        text.innerHTML = textBlocks[activeIndex].innerHTML;
                    }
                },
            },
        });

        aboutSwipersInited = true;
    });
};

let wineDetailsSwiperInited = false;
let winesOtherSwiper = null;
export const initWineDetailsSwiper = () => {
    // if (wineDetailsSwiperInited) return;
    if (wineDetailsSwiperInited && winesOtherSwiper) {
        winesOtherSwiper.destroy(true, true);
    }

    const wineOtherEl = document.querySelector('.wine-other');

    if (!wineOtherEl) {
        console.warn('Swiper containers not found');
        return;
    }

    // const winesOtherSwiper = new Swiper(wineOtherEl, {
    //     modules: [Navigation],
    //     centeredSlides: window.innerWidth >= 768,
    //     slidesPerView: 3,
    //     navigation: {
    //         nextEl: '.wine-other-next',
    //         prevEl: '.wine-other-prev',
    //     },
    //     loop: false,
    //     watchSlidesProgress: true,
    //     watchSlidesVisibility: true,
    // });

    requestAnimationFrame(() => {
        setWineSlideWidths();

        const winesOtherSwiper = new Swiper(wineOtherEl, {
            modules: [Navigation],
            slidesPerView: 'auto',
            centeredSlides: false,
            navigation: {
                nextEl: '.wine-other-next',
                prevEl: '.wine-other-prev',
            },
            loop: false,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
        });

        wineDetailsSwiperInited = true;
        requestAnimationFrame(() => {
            winesOtherSwiper.update();
        });
    });
};

const setWineSlideWidths = () => {
    const slides = document.querySelectorAll('.wine-other .swiper-slide');
    const ww = window.innerWidth;

    let slideWidth = null;

    if (ww < 500) {
        slideWidth = ww;
    } else if (ww >= 500 && ww < 1024) {
        slideWidth = ww / 2;
    } else {
        slideWidth = ww / 3;
    }

    if (slideWidth) {
        slides.forEach((slide) => {
            slide.style.width = `${slideWidth}px`;
        });
    } else {
        slides.forEach((slide) => {
            slide.style.width = '';
        });
    }
};

window.addEventListener('resize', setWineSlideWidths);
requestAnimationFrame(setWineSlideWidths);
