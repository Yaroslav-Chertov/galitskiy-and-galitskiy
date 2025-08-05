export default class Popup {
    constructor(options = {}) {
        this.onPopupOpen = options.onPopupOpen || (() => {});
        this.onPopupClose = options.onPopupClose || (() => {});
        this.popupOpenControls = document.querySelectorAll('[data-open-popup]');
        this.popupCloseControls = document.querySelectorAll('[data-elts~="closePopup"]');
        this.popups = [...document.querySelectorAll('[data-popup]:not(body)')];

        this.popupOpenControls?.forEach((control) => {
            control.addEventListener('click', (event) => {
                this.open(control.dataset.openPopup, control.dataset.popupOptions, control);
            });
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });

/*         this.popups.map((p) => {
            p.addEventListener('click', (e) => {
                const contentClick = e.target.closest('.popup');

                if (!contentClick) {
                    this.closeAll();
                }
            })
        }); */

        if (!options.disablePopupCloseHandler) {
            this.popupCloseControls?.forEach((control) => {
                control.addEventListener('click', (event) => {
                    this.closeAll();
                });
            });
        }
    }

    open = (id, options, control) => {
        this.popups.forEach((popupElt) => {
            /* if (options) {
                if (popupElt.dataset.popup === id) {
                    popupElt.classList.add('is-open');
                }
            } else {
            } */
            popupElt.classList.toggle('is-open', popupElt.dataset.popup === id);

            if (popupElt.dataset.popup === id) {
                this.onPopupOpen(id, popupElt, options, control);
            }
        });
    }

    close = (name) => {
        this.popups.forEach((popupElt) => {
            if (popupElt.dataset.popup === name) {
                popupElt.classList.remove('is-open');
            }
        });

        this.onPopupClose(name);
    }

    closeAll = () => {
        this.popups.forEach((popupElt) => {
            popupElt.classList.remove('is-open');
        })

        this.onPopupClose();
    }
}
