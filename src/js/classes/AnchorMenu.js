/**
 * Якорное меню (.anchor-menu): подсвечивает пункт раздела, который сейчас на экране.
 * Активен последний раздел, верх которого уже ушёл под меню — та же логика, что в меню сотрудника (team-head).
 * На узком экране список прокручивается, поэтому активный пункт подводится в середину полосы.
 * Плавный переход по пунктам делает штатный MoveTo, здесь его нет.
 */
class AnchorMenu {
    constructor(el, config = {}) {
        const defaultConfig = {
            selectors: {
                list: '.anchor-menu__list',
                link: '.anchor-menu__link'
            },
            activeClass: '-is-active',
            // меню прилипло к верху (стили показывают кнопку) и класс-признак, что прилипание отслеживается
            stuckClass: '-is-stuck',
            watchedClass: '-is-watched',
            // зазор под меню, после которого раздел считается текущим
            offset: 24,
            // допуск к месту, где MoveTo останавливает цель (data-mt-tolerance пункта)
            landing: 8
        };

        this.config = Object.assign(defaultConfig, config);

        this.el = el;
        this.list = el.querySelector(this.config.selectors.list);
        this.sections = [];
        this.active = null;
        this.ticking = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        el.querySelectorAll(this.config.selectors.link).forEach((link) => {
            const target = document.querySelector(link.getAttribute('href'));

            if (target) {
                // у заголовка с надзаголовком запас больше: цель останавливается ниже, и порог должен быть ниже тоже
                const tolerance = Number(link.dataset.mtTolerance) || 0;
                this.sections.push({ link, target, tolerance });
            } else {
                // раздела нет на странице (блок не вывелся) — пункт, ведущий в никуда, прячем
                (link.closest('li') || link).hidden = true;
            }
        });

        if (!this.sections.length) {
            return;
        }

        this.el.classList.add(this.config.watchedClass);
        window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        this.update();
    }

    onScroll() {
        if (this.ticking) {
            return;
        }

        this.ticking = true;
        window.requestAnimationFrame(() => {
            this.update();
            this.ticking = false;
        });
    }

    update() {
        const menuRect = this.el.getBoundingClientRect();
        const offset = menuRect.height + this.config.offset;

        // sticky top: 0 — прилипшее меню стоит ровно у верха окна
        this.el.classList.toggle(this.config.stuckClass, menuRect.top <= 0);
        let current = null;

        this.sections.forEach((section) => {
            if (section.target.getBoundingClientRect().top <= Math.max(offset, section.tolerance + this.config.landing)) {
                current = section;
            }
        });

        this.sections.forEach((section) => {
            section.link.classList.toggle(this.config.activeClass, section === current);
        });

        if (current && current !== this.active) {
            this.reveal(current.link);
        }

        this.active = current;
    }

    reveal(link) {
        if (!this.list || this.list.scrollWidth <= this.list.clientWidth) {
            return;
        }

        const left = link.offsetLeft - (this.list.clientWidth - link.offsetWidth) / 2;

        this.list.scrollTo({ left: Math.max(0, left), behavior: this.reducedMotion ? 'auto' : 'smooth' });
    }
}

export default AnchorMenu;
