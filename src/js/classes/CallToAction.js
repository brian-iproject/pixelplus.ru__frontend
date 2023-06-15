export default class CallToAction {
    constructor(cssClass, threshold = 1) {
        this.cssClass = cssClass;
        this.threshold = threshold;

        this.element = document.querySelector(`.${this.cssClass}`);

        if (this.element === null) {
            return;
        }

        this.openButton = this.element.querySelector(`.${this.cssClass}__open`);
        this.closeButton = this.element.querySelector(`.${this.cssClass}__close`);

        this.state = this._makeProxy({
            isHidden: true,
            isOpened: false
        });

        this._onScroll = this._onScroll.bind(this);
        this._onOpen = this._onOpen.bind(this);
        this._onClose = this._onClose.bind(this);
        this._onKeydown = this._onKeydown.bind(this);
        this._onOutsideClick = this._onOutsideClick.bind(this);

        this._setEventListeners();
    }

    _makeProxy(state) {
        return new Proxy(state, {
            set: (object, key, value) => {
                if (key === "isOpened") {
                    this.element.classList.toggle(`${this.cssClass}--opened`, value);
                }

                if (key === "isHidden") {
                    this.element.classList.toggle(`${this.cssClass}--hidden`, value);
                }

                object[key] = value;
                return true;
            }
        });
    }

    _setEventListeners() {
        this.openButton.addEventListener('click', this._onOpen);
        this.closeButton.addEventListener('click', this._onClose);

        this._onScroll();
        window.addEventListener('scroll', this._onScroll);
        document.addEventListener('click', this._onOutsideClick);
        document.addEventListener('keydown', this._onKeydown);
    }

    _onScroll() {
        const isHidden = window.scrollY <= window.innerHeight * this.threshold;

        this.state.isHidden = isHidden;

        if (isHidden) {
            this._onClose();
        } else {
            this.element.classList.add(`${this.cssClass}--shown`);
        }
    }

    _onOpen() {
        this.state.isOpened = true;
    }

    _onClose() {
        this.state.isOpened = false;
    }

    _onKeydown(e) {
        if (e.key === 'Escape') {
            this._onClose();
        }
    }

    _onOutsideClick(e) {
        if (e.target && !e.target.closest(`.${this.cssClass}`)) {
            this._onClose();
        }
    }

    static init() {
        new CallToAction('call-to-action', 0.5);
    }
}
