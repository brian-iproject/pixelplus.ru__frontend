export default class SimpleDiagram {
    constructor(element) {
        this.element = element;

        this.columns = [...this.element.querySelectorAll('.diagram__column')];
        this.percents = this.columns.map(column => Math.round(Number(column.dataset.percent.replace('%', ''))) / 100);

        this._handleIntersect = this._handleIntersect.bind(this);

        this._createObserver();
    }

    _createObserver() {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.65,
        };

        const observer = new IntersectionObserver(this._handleIntersect, options);
        observer.observe(this.element);
    }

    _handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this._animate();
            }
        })
    }

    _animate() {
        const k = 1 / Math.max(...this.percents);

        this.columns.forEach((column, i) => {
            column.style.transform = `translateY(${100 - Math.round(this.percents[i] * k * 100)}%)`
        })
    }

    static init() {
        const elements = document.querySelectorAll('.js-simple-diagram');
        elements.forEach(element => {
            new SimpleDiagram(element);
        })
    }
}
