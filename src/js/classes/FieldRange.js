class FieldRange {

    constructor(element, options) {
        if (!element) return false;

        this.element = element;
        this.input = this.element.querySelector('input[type="range"]');

        this.options = {
            resultFormula: false,
            current: '.field-range__current',
            on: {
                init: () => {}
            },
            ...options
        }

        if (this.options.current) {
            this.currentContainer = element.querySelector(this.options.current);
            this.current = this.currentContainer.querySelector('output');
        }

        this.params = this._getParams();

        if (this.options.current) {
            this._renderCurrent();
        }

        document.addEventListener('input', this._onInput);

        this.options.on.init(this.element, Number(this.input.value));
    }

    _getParams = () => {
        return {
            min: this.input.min,
            max: this.input.max,
            step: this.input.step,
        };
    }

    _renderCurrent = () => {
        this.input.style.backgroundSize = `${this._getPositionPoint(this.input.value)}% 100%`;
        this.current.textContent = this.input.value;
        this.currentContainer.style.left = `calc(${this._getPositionPoint(this.input.value)}%)`;
        this.currentContainer.style.transform = `translateX(-${this._getPositionPoint(this.input.value)}%)`;
    }

    _getPositionPoint = (currentValue) => {
        return (currentValue - this.params.min) / (this.params.max - this.params.min) * 100;
    }

    _onInput = (e) => {
        if (this.options.current) {
            this._renderCurrent();
        }

        this.options.on.change(this.element, Number(this.input.value));
    }

    static init(element, options) {
        new FieldRange(element, options);
    }
}

export default FieldRange;