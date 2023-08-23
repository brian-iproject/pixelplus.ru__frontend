export class SimpleDiagram {
    constructor(element) {
        this.element = element;

        this.columns = [...this.element.querySelectorAll('.diagram__column')];
        this.percents = this.columns.map(column => Math.round(Number(column.dataset.percent.replace('%', ''))) / 100);
        this.scalingCoefficient = 1 / Math.max(...this.percents);

        this._handleIntersect = this._handleIntersect.bind(this);
    }

    init() {
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
        this.columns.forEach((column, i) => {
            column.style.transform = `translateY(${100 - Math.round(this.percents[i] * this.scalingCoefficient * 100)}%)`
        })
    }

    static init() {
        const elements = document.querySelectorAll('.js-simple-diagram');
        elements.forEach(element => {
            const diagram = new SimpleDiagram(element);
            diagram.init();
        })
    }
}

export class SimpleDiagramGroup {
    constructor(container) {
        const elements = [...container.querySelectorAll('.js-simple-diagram')];
        const diagrams = elements.map(element => {
            return new SimpleDiagram(element);
        })

        // Находим минимальный коэффициент среди диаграм и задаём его для всех диаграм
        const min = Math.min(...diagrams.map(diagram => diagram.scalingCoefficient));
        diagrams.forEach(diagram => {
            diagram.scalingCoefficient = min;
            diagram.init();
        })
    }

    static init() {
        const containers = document.querySelectorAll('.js-simple-diagram-group');
        containers.forEach(container => {
            new SimpleDiagramGroup(container);
        })
    }
}
