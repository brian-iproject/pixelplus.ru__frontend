class FieldFile {
    constructor(el, config = {}) {
        const defaultConfig = {
            inputSelector: 'input[type=file]',
            labelSelector: '.field-file__name-text',
            activeClass: '-is-active'
        };

        this.config = Object.assign(defaultConfig, config);

        this.el = el;
        this.input = el.querySelector(this.config.inputSelector);
        this.label = el.querySelector(this.config.labelSelector);
        this.labelVal = this.label.innerHTML;

        this.input.addEventListener('change', (e) => this._onChange(e));
    }

    _onChange = (e) => {
        let fileName = null;

        if (e.target.files) {
            fileName = this._getFileName(e.target);
        }

        if (fileName) {
            this.label.innerHTML = fileName;
        } else {
            this.label.innerHTML = this.labelVal;
        }
    }

    _getFileName = (el) => {
        return  (el.files.length > 1) ?
                (el.getAttribute('data-multiple-caption') || '').replace('{count}', el.files.length) :
                el.value.split('\\').pop();
    }
}

export default FieldFile;