import {disableBodyScroll, enableBodyScroll} from 'body-scroll-lock';

export default class TimerModal {
    constructor(cssClass, animationDuration = 1) {
        if (this._isDisabled()) return;

        this.cssClass = cssClass;
        this.animationDuration = animationDuration;

        this.element = document.querySelector(`.${this.cssClass}`);

        if (this.element === null) {
            return;
        }

        this._startTimer = this._startTimer.bind(this);
        this._startAnimation = this._startAnimation.bind(this);
        this._endAnimation = this._endAnimation.bind(this);
        this._closeModal = this._closeModal.bind(this);
        this._onKeydown = this._onKeydown.bind(this);
        this._onOutsideClick = this._onOutsideClick.bind(this);

        this._setCssProperties();
        this._setEventListeners();
    }

    _setEventListeners() {
        const button = this.element.querySelector(`.${this.cssClass}__rocket-button`);
        button.addEventListener('click', this._startAnimation);

        const closeButton = this.element.querySelector(`.${this.cssClass}__close`);
        closeButton.addEventListener('click', this._closeModal);

        window.addEventListener('DOMContentLoaded', this._startTimer);
    }

    _setEventListenersAfterAnimation() {
        document.addEventListener('click', this._onOutsideClick);
        document.addEventListener('keydown', this._onKeydown);

        const links = this.element.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', this._closeModal);
        })
    }

    _removeEventListenersAfterAnimation() {
        document.removeEventListener('click', this._onOutsideClick);
        document.removeEventListener('keydown', this._onKeydown);
    }

    _startTimer() {
        this.element.classList.add(`${this.cssClass}--initialized`);

        const rocket = this.element.querySelector(`.${this.cssClass}__rocket`);
        let seconds = Number(rocket.dataset.timer);

        const timer = setInterval(() => {
            if (seconds === 0) {
                clearTimeout(timer);
                this._enableStart();
            } else {
                rocket.dataset.timer = seconds.toString();
                seconds--;
            }
        }, 1000);
    }

    _enableStart() {
        this.element.classList.add(`${this.cssClass}--ready`);
    }

    _startAnimation() {
        disableBodyScroll(this.element);

        this.element.classList.remove(`${this.cssClass}--ready`);
        this.element.classList.add(`${this.cssClass}--active`);

        setTimeout(this._endAnimation, this.animationDuration * 1000);
    }

    _endAnimation() {
        this.element.classList.add(`${this.cssClass}--complete`);

        this._setEventListenersAfterAnimation();
    }

    _closeModal() {
        enableBodyScroll(this.element);

        this.element.classList.add(`${this.cssClass}--closed`);

        this._removeEventListenersAfterAnimation();

        this._setLocalStorage();
    }

    _onKeydown(e) {
        if (e.key === 'Escape') {
            this._closeModal();
        }
    }

    _onOutsideClick(e) {
        if (e.target && !e.target.closest(`.${this.cssClass}__window`)) {
            this._closeModal();
        }
    }

    _setCssProperties() {
        document.documentElement.style.setProperty('--js-timer-modal-animation-duration', this.animationDuration + 's')
    }

    _setLocalStorage() {
        localStorage.setItem("timer-modal-closed", new Date().getTime().toString());
    }

    _isDisabled() {
        const date = localStorage.getItem("timer-modal-closed");
        const now = new Date().getTime().toString();

        const isExpired = now - date >= 2592000;

        // Если прошло 30 дней, то удаляем
        if (isExpired) {
            localStorage.removeItem("timer-modal-closed");
        }

        return !isExpired;
    }

    static init() {
        new TimerModal('timer-modal');
    }
}
