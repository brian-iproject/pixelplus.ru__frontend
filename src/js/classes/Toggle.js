class Toggle {
    constructor(el, config = {}) {
        // Валидация входных параметров
        if (!el || !(el instanceof Element)) {
            throw new Error('Toggle requires a valid DOM element');
        }

        const defaultConfig = {
            relatedEl: null,
            parent: null,
            targetSelector: null,
            target: null,
            activeClass: '-is-active',
            on: {
                beforeActivate: () => {},
                activate: () => {},
                deactivate: () => {}
            }
        };

        this.config = {
            ...defaultConfig,
            ...config,
            on: {
                ...defaultConfig.on,
                ...config.on,
            }
        };
        this.el = el;
        this.parent = this.config.parent || document;

        // Находим целевой элемент
        this.target = this._resolveTarget();

        if (this.target) {
            this.el.addEventListener('click', this._onClick);
        }
    }

    _resolveTarget() {
        if (this.config.target) {
            return this.config.target;
        }

        if (this.config.targetSelector) {
            const target = this.parent.querySelector(this.config.targetSelector);
            if (!target) {
                console.warn(`Toggle: target not found with selector "${this.config.targetSelector}"`);
            }
            return target;
        }

        return null;
    }

    _onClick = (e) => {
        e.preventDefault();

        const isCurrentlyActive = this.isActive(this.el);

        if (!isCurrentlyActive) {
            this.config.on.beforeActivate();
            this.activate();
            this.config.on.activate();
        } else {
            this.deactivate();
            this.config.on.deactivate();
        }
    }

    isActive(element = this.el) {
        return element.classList.contains(this.config.activeClass);
    }

    activate() {
        this._toggleElement(this.el, true);

        if (this.target) {
            this._toggleElement(this.target, true);
        }

        if (this.config.relatedEl) {
            this.parent.querySelectorAll(this.config.relatedEl).forEach(el => {
                this._toggleElement(el, true);
            });
        }
    }

    deactivate() {
        this._toggleElement(this.el, false);

        if (this.target) {
            this._toggleElement(this.target, false);
        }

        if (this.config.relatedEl) {
            this.parent.querySelectorAll(this.config.relatedEl).forEach(el => {
                this._toggleElement(el, false);
            });
        }
    }

    toggle() {
        if (this.isActive()) {
            this.deactivate();
            this.config.on.deactivate();
        } else {
            this.config.on.beforeActivate();
            this.activate();
            this.config.on.activate();
        }
    }

    _toggleElement(element, activate) {
        if (activate) {
            element.classList.add(this.config.activeClass);
        } else {
            element.classList.remove(this.config.activeClass);
        }
    }

    // Публичные методы для внешнего управления
    getState() {
        return this.isActive();
    }

    destroy() {
        this.el.removeEventListener('click', this._onClick);
    }
}

export default Toggle;