import Utils from "./Utils.js";

class LockedButton {
    constructor(el, config = {}) {
        const defaultConfig = {
            selectors: {
                container: null,
                button: null
            },
            wrapperClass: 'locked-button',
            activeClass: '-is-active'
        };

        this.config = Object.assign(defaultConfig, config);

        this.el = el;
        this.button = this.el.querySelector(this.config.selectors.button);

        if (!this.button) return false;

        this.buttonWrapper = this.button.closest('.locked-button') ?
                            this.button.closest('.locked-button') :
                            Utils.wrapElement(this.button, 'div', this.config.wrapperClass);

        this._setEventListeners();
    }

    _setEventListeners() {
        this.el.addEventListener('submit', (e) => {
            this.buttonWrapper.classList.add(this.config.activeClass);
        });
    }
}

export default LockedButton;