/**
 * Столбчатый график (.bar-chart): подсказка и подсветка столбца, прорисовка при прокрутке.
 * Наведение или фокус на столбец делает его активным: остальные приглушаются, рядом всплывает подсказка —
 * период, значение и пояснение (изменение к первому периоду или исходное значение) из data-атрибутов колонки.
 * Колонки получают tabindex — доступны с клавиатуры. На касание подсказка закрывается касанием вне графика.
 * График ниже экрана «вырастает», когда до него докрутили; при prefers-reduced-motion — сразу готовый.
 * Без JS всё видно: столбцы, шкала и подписи готовы с сервера.
 */
class BarChart {
    constructor(el, config = {}) {
        const defaultConfig = {
            selectors: {
                col: '[data-bar-index]',
                bar: '.bar-chart__bar',
                // за ним же следит прорисовка: видимая часть столбцов, а не подпись под графиком
                scroll: '.bar-chart__scroll'
            },
            tooltipClass: 'bar-chart__tooltip',
            activeClass: '-is-active',
            hasActiveClass: '-has-active',
            pendingClass: '-is-pending',
            // признак, что график уже подключён (защита от повторной инициализации)
            readyClass: '-is-ready',
            // зазор между столбцом и подсказкой, px
            gap: 8,
            // доля графика на экране, после которой столбцы начинают расти
            threshold: .4
        };

        const selectors = Object.assign({}, defaultConfig.selectors, config.selectors);
        this.config = Object.assign(defaultConfig, config, { selectors });

        if (el.classList.contains(this.config.readyClass)) {
            return;
        }

        this.el = el;
        this.cols = Array.from(el.querySelectorAll(this.config.selectors.col));
        this.scroll = el.querySelector(this.config.selectors.scroll);
        this.active = null;

        if (!this.cols.length) {
            return;
        }

        el.classList.add(this.config.readyClass);
        this.tooltip = this.createTooltip();

        this.cols.forEach((col) => {
            col.setAttribute('tabindex', '0');
        });

        el.addEventListener('mouseover', (e) => this.activate(this.indexOf(e.target)));
        el.addEventListener('mouseleave', () => this.activate(null));
        el.addEventListener('focusin', (e) => this.activate(this.indexOf(e.target)));
        el.addEventListener('focusout', (e) => {
            if (!el.contains(e.relatedTarget)) {
                this.activate(null);
            }
        });
        document.addEventListener('pointerdown', (e) => {
            if (this.active !== null && !el.contains(e.target)) {
                this.activate(null);
            }
        });
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.activate(null);
            }
        });

        const reposition = () => {
            if (this.active !== null) {
                this.place(this.cols[this.active]);
            }
        };
        if (this.scroll) {
            this.scroll.addEventListener('scroll', reposition, { passive: true });
        }
        window.addEventListener('resize', reposition);

        this.watchGrow();
    }

    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = this.config.tooltipClass;
        tooltip.setAttribute('aria-hidden', 'true');
        tooltip.hidden = true;

        ['label', 'value', 'note'].forEach((name) => {
            const span = document.createElement('span');
            span.className = `${this.config.tooltipClass}-${name}`;
            tooltip.appendChild(span);
        });

        this.el.appendChild(tooltip);
        return tooltip;
    }

    indexOf(target) {
        const col = target.closest ? target.closest(this.config.selectors.col) : null;
        return col && this.el.contains(col) ? this.cols.indexOf(col) : null;
    }

    activate(index) {
        if (index === this.active) {
            return;
        }

        this.active = index;
        this.el.classList.toggle(this.config.hasActiveClass, index !== null);
        this.cols.forEach((col, i) => col.classList.toggle(this.config.activeClass, i === index));

        if (index === null) {
            this.tooltip.hidden = true;
            return;
        }

        const col = this.cols[index];
        const [label, value, note] = this.tooltip.children;
        const noteText = col.dataset.barNote || '';

        label.textContent = col.dataset.barLabel || '';
        value.textContent = col.dataset.barValue || '';
        note.textContent = noteText;
        note.classList.toggle('-is-up', noteText.charAt(0) === '+');

        this.tooltip.hidden = false;
        this.place(col);
    }

    // Подсказка — справа от столбца на уровне его верха, не помещается — слева; не выходит за края графика
    place(col) {
        const bar = col.querySelector(this.config.selectors.bar) || col;
        const box = this.el.getBoundingClientRect();
        const rect = bar.getBoundingClientRect();
        const { gap } = this.config;
        const width = this.tooltip.offsetWidth;
        const height = this.tooltip.offsetHeight;

        let left = rect.right + gap - box.left;
        if (left + width > box.width) {
            left = rect.left - gap - width - box.left;
        }
        left = Math.max(0, Math.min(left, box.width - width));

        const bottom = rect.bottom - box.top;
        const top = Math.max(0, Math.min(rect.top - box.top - height / 2, bottom - height));

        this.tooltip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    }

    // Рост только для графика ниже экрана: то, что уже видно при загрузке, не прячем и не мигаем им
    watchGrow() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reducedMotion || !('IntersectionObserver' in window)
            || this.el.getBoundingClientRect().top < window.innerHeight) {
            return;
        }

        const { pendingClass } = this.config;
        this.el.classList.add(pendingClass);

        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) {
                return;
            }

            observer.disconnect();
            this.el.classList.remove(pendingClass);
        }, { threshold: this.config.threshold });

        observer.observe(this.scroll || this.el);
    }
}

export default BarChart;
