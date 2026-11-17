/**
 * Круговая диаграмма (.donut-chart): связывает сегменты кольца и строки легенды.
 * Наведение или фокус на сегмент либо строку делает долю активной: остальные сегменты приглушаются,
 * строка подсвечивается, в центре — значение и подпись доли. Ушли — в центре снова значение по умолчанию
 * (самая большая доля и подпись из настроек блока). Сегменты и строки получают tabindex — доступны с клавиатуры.
 * Кольцо ниже экрана прорисовывается, когда до него докрутили; при prefers-reduced-motion — сразу целиком.
 * Без JS всё видно: разметка и кольцо готовы с сервера.
 */
class DonutChart {
    constructor(el, config = {}) {
        const defaultConfig = {
            selectors: {
                item: '[data-donut-index]',
                center: '.donut-chart__center',
                centerValue: '.donut-chart__center-value',
                centerLabel: '.donut-chart__center-label',
                // за чем следит прорисовка: само кольцо, а не весь блок с таблицей
                chart: '.donut-chart__chart'
            },
            activeClass: '-is-active',
            hasActiveClass: '-has-active',
            pendingClass: '-is-pending',
            drawingClass: '-is-drawing',
            // признак, что диаграмма уже подключена (защита от повторной инициализации)
            readyClass: '-is-ready',
            // доля кольца на экране, после которой оно начинает прорисовываться
            threshold: .5
        };

        const selectors = Object.assign({}, defaultConfig.selectors, config.selectors);
        this.config = Object.assign(defaultConfig, config, { selectors });

        if (el.classList.contains(this.config.readyClass)) {
            return;
        }

        this.el = el;
        this.items = Array.from(el.querySelectorAll(this.config.selectors.item));
        this.center = el.querySelector(this.config.selectors.center);
        this.centerValue = el.querySelector(this.config.selectors.centerValue);
        this.centerLabel = el.querySelector(this.config.selectors.centerLabel);
        this.active = null;

        if (!this.items.length) {
            return;
        }

        el.classList.add(this.config.readyClass);

        this.items.forEach((item) => {
            item.setAttribute('tabindex', '0');
        });

        el.addEventListener('mouseover', (e) => this.activate(this.indexOf(e.target)));
        el.addEventListener('mouseleave', () => this.activate(null));
        el.addEventListener('focusin', (e) => this.activate(this.indexOf(e.target)));
        el.addEventListener('focusout', (e) => {
            if (!el.contains(e.relatedTarget)) {
                this.activate(null);
            }
        });

        this.watchDraw();
    }

    indexOf(target) {
        const item = target.closest ? target.closest(this.config.selectors.item) : null;
        return item && this.el.contains(item) ? item.dataset.donutIndex : null;
    }

    activate(index) {
        if (index === this.active) {
            return;
        }

        this.active = index;
        this.el.classList.toggle(this.config.hasActiveClass, index !== null);

        let source = this.center;
        this.items.forEach((item) => {
            const isActive = item.dataset.donutIndex === index;
            item.classList.toggle(this.config.activeClass, isActive);

            if (isActive && item.dataset.donutValue) {
                source = item;
            }
        });

        if (source && this.centerValue && this.centerLabel) {
            this.centerValue.textContent = source.dataset.donutValue || '';
            this.centerLabel.textContent = source.dataset.donutLabel || '';
        }
    }

    // Прорисовка только для кольца ниже экрана: то, что уже видно при загрузке, не прячем и не мигаем им
    watchDraw() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reducedMotion || !('IntersectionObserver' in window)
            || this.el.getBoundingClientRect().top < window.innerHeight) {
            return;
        }

        const { pendingClass, drawingClass } = this.config;
        this.el.classList.add(pendingClass);

        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) {
                return;
            }

            observer.disconnect();
            this.el.classList.add(drawingClass);
            // два кадра: переход должен стартовать от уже применённого пустого кольца
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => this.el.classList.remove(pendingClass));
            });

            // после прорисовки длинный переход stroke-dasharray больше не нужен — иначе он мешал бы наведению
            const last = this.items.filter((item) => item.tagName.toLowerCase() === 'circle').pop();
            const onEnd = (e) => {
                if (e.propertyName === 'stroke-dasharray') {
                    last.removeEventListener('transitionend', onEnd);
                    this.el.classList.remove(drawingClass);
                }
            };
            if (last) {
                last.addEventListener('transitionend', onEnd);
            }
        }, { threshold: this.config.threshold });

        observer.observe(this.el.querySelector(this.config.selectors.chart) || this.el);
    }
}

export default DonutChart;
