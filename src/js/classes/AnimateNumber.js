/**
 * Класс для плавной анимации числовых значений с поддержкой:
 * - Автоматического запуска при появлении в viewport (Intersection Observer)
 * - Гибкой настройки через data-атрибуты и параметры
 * - Различных функций плавности (easing)
 * - Расширенного форматирования чисел (разделители, локализация, валюта)
 * - Кастомных форматов вывода
 *
 * @version 2.0.0
 * @license MIT
 */
class AnimateNumber {
    /**
     * Дефолтные параметры анимации
     * @static
     * @type {Object}
     * @property {number} [start=0] - Начальное значение
     * @property {number} [end=100] - Конечное значение
     * @property {number} [duration=1000] - Длительность анимации (мс)
     * @property {number} [fps=60] - Кадров в секунду (12-120)
     * @property {number} [delay=0] - Задержка перед стартом (мс)
     * @property {number} [decimals=0] - Знаков после запятой
     * @property {string} [decimalSeparator='.'] - Разделитель десятичных
     * @property {string} [thousandSeparator=','] - Разделитель тысяч
     * @property {Function|null} [format=null] - Кастомная функция форматирования
     * @property {string|null} [locale=null] - Локаль для Intl (ru-RU, en-US)
     * @property {string|null} [currency=null] - Валюта (USD, EUR, RUB)
     * @property {Object|null} [formatOptions=null] - Доп. опции для Intl
     * @property {string} [prefix=''] - Текст перед числом
     * @property {string} [suffix=''] - Текст после числа
     * @property {string} [easing='linear'] - Функция плавности
     * @property {boolean} [autoStart=true] - Автостарт анимации
     * @property {number} [observerThreshold=0.1] - Порог срабатывания Observer
     * @property {string} [observerRootMargin='0px'] - Отступы для Observer
     * @property {string|null} [observerRoot=null] - Корневой элемент Observer
     * @property {boolean} [observerOnce=true] - Однократное срабатывание Observer
     */
    static DEFAULT_PARAMS = {
        start: 0,
        end: 100,
        duration: 2000,
        fps: 60,
        delay: 0,
        decimals: 0,

        decimalSeparator: '.',
        thousandSeparator: ',',
        format: null,
        locale: null,
        currency: null,
        formatOptions: null,

        prefix: '',
        suffix: '',
        easing: 'linear',
        autoStart: true,
        observerThreshold: 0.5,
        observerRootMargin: '0px',
        observerRoot: null,
        observerOnce: true
    };

    /**
     * Создает экземпляр аниматора чисел
     * @param {HTMLElement} element - Элемент для анимации
     * @param {Object} [options={}] - Параметры анимации
     * @param {Function} [options.onSetup] - Колбек при инициализации
     * @param {Function} [options.onUpdate] - Колбек при обновлении значения
     * @param {Function} [options.onComplete] - Колбек при завершении
     * @throws {Error} Если element не является HTMLElement
     */
    constructor(element, options = {}) {
        if (!(element instanceof HTMLElement)) {
            //throw new Error('AnimateNumber: element must be a valid HTMLElement');
            console.error('AnimateNumber: element must be a valid HTMLElement');
            return false;
        }

        this.element = element;
        this._setParams(options);
        this._setup();
        this._initIntersectionObserver();
    }

    /**
     * Парсит числовое значение из строки
     * @private
     * @param {string|number} value - Значение для парсинга
     * @returns {number|null} Распарсенное число или null
     */
    // _parseNumber(value) {
    //     if (value === null || value === undefined) return null;
    //     const cleaned = String(value).replace(/[^\d.-]/g, '');
    //     const num = parseFloat(cleaned);
    //     return isNaN(num) ? null : num;
    // }

    _parseNumber(value) {
        if (value === null || value === undefined) return null;

        // Удаляем все нецифровые символы, кроме точек и минусов
        let cleaned = String(value)
            .replace(/[^\d.-]/g, '')
            // Удаляем все точки, кроме последней (для корректного распознавания десятичных)
            .replace(/(.*\..*)\./g, '$1');

        // Обрабатываем случаи типа "1.000.50" -> "1000.50"
        if ((cleaned.match(/\./g) || []).length > 1) {
            cleaned = cleaned.replace(/\./g, '').replace(/(\d+)(\d{2})$/, '$1.$2');
        }

        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }

    /**
     * Парсит параметры из data-атрибутов элемента
     * @private
     * @param {Object} options - Переданные при создании параметры
     * @returns {Object} Объект с распарсенными атрибутами
     */
    _parseAttributes() {
        const dataset = this.element.dataset;
        const endFromText = this._parseNumber(
            this.element.textContent.trim()
                .replace(/(\d+)\.(\d{3})/g, '$1$2')
                .replace(/,(\d+)/g, '.$1')
        );

        return {
            start: this._parseNumber(dataset.animateNumberStart),
            end: this._parseNumber(dataset.animateNumberEnd) ?? endFromText,
            duration: this._parseNumber(dataset.animateNumberDuration),
            fps: this._parseNumber(dataset.animateNumberFps),
            delay: this._parseNumber(dataset.animateNumberDelay),
            decimals: this._parseNumber(dataset.animateNumberDecimals),

            decimalSeparator: dataset.animateNumberDecimalSeparator,
            thousandSeparator: dataset.animateNumberThousandSeparator,
            locale: dataset.animateNumberLocale,
            currency: dataset.animateNumberCurrency,

            prefix: dataset.animateNumberPrefix,
            suffix: dataset.animateNumberSuffix,
            easing: dataset.animateNumberEasing,
            autoStart: dataset.animateNumberAutoStart !== undefined
                ? dataset.animateNumberAutoStart !== 'false'
                : undefined,
            observerThreshold: this._parseNumber(dataset.animateNumberObserverThreshold),
            observerRootMargin: dataset.animateNumberObserverRootMargin,
            observerRoot: dataset.animateNumberObserverRoot,
            observerOnce: dataset.animateNumberObserverOnce !== undefined
                ? dataset.animateNumberObserverOnce !== 'false'
                : undefined
        };
    }

    /**
     * Устанавливает параметры класса с приоритетом data-атрибутов
     * @private
     * @param {Object} options - Переданные при создании параметры
     */
    _setParams(options) {
        const parsedAttributes = this._parseAttributes();

        // Создаем объект параметров с приоритетом:
        // 1. Data-атрибуты (если не undefined)
        // 2. Параметры из options (если не undefined)
        // 3. Значения по умолчанию
        this.params = {
            ...AnimateNumber.DEFAULT_PARAMS,
            ...options,
            ...Object.fromEntries(
                Object.entries(parsedAttributes)
                    .filter(([_, value]) => value !== undefined && value !== null)
            )
        };

        // Применяем ограничения и преобразования
        this.params.fps = Math.min(Math.max(this.params.fps, 12), 120);
        this.params.decimals = Math.max(0, this.params.decimals);

        // Сохраняем callback-функции (они не должны перезаписываться data-атрибутами)
        this.params.onSetup = options.onSetup || null;
        this.params.onUpdate = options.onUpdate ?? null;
        this.params.onComplete = options.onComplete ?? null;

        // Особый случай для format и formatOptions - они не могут быть заданы через data-атрибуты
        this.params.format = options.format ?? null;
        this.params.formatOptions = options.formatOptions ?? null;
    }

    /**
     * Инициализирует внутреннее состояние аниматора
     * @private
     */
    _setup() {
        if (this.params.onSetup) {
            this.params.onSetup(this.params);
        }

        this.currentValue = this.params.start;
        this.startTime = null;
        this.animationId = null;
        this.isAnimating = false;
        this.delayPassed = false;
        this.lastProgress = 0;

        /** @constant */
        this.EASING_FUNCTIONS = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };

        this.easing = this.EASING_FUNCTIONS[this.params.easing] || this.EASING_FUNCTIONS.linear;

        if (this.params.autoStart && !this.params.observerRoot) {
            this.start();
        }
    }

    /**
     * Инициализирует Intersection Observer для автоматического старта
     * @private
     */
    _initIntersectionObserver() {
        if (!this.params.autoStart || !('IntersectionObserver' in window)) return;

        let root = null;
        if (this.params.observerRoot) {
            root = typeof this.params.observerRoot === 'string'
                ? document.querySelector(this.params.observerRoot)
                : this.params.observerRoot;

            if (!root) {
                console.warn(`AnimateNumber: observerRoot "${this.params.observerRoot}" not found, using default`);
            }
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.start();
                    if (this.params.observerOnce) {
                        this.observer.unobserve(this.element);
                    }
                }
            });
        }, {
            threshold: this.params.observerThreshold,
            rootMargin: this.params.observerRootMargin,
            root: root
        });

        this.observer.observe(this.element);
    }

    /**
     * Запускает анимацию
     * @returns {void}
     */
    start() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.currentValue = this.params.start;
        this._updateDisplay();

        if (this.params.delay > 0) {
            setTimeout(() => {
                this.delayPassed = true;
                this.startTime = performance.now() - (this.lastProgress * this.params.duration);
                this._animate();
            }, this.params.delay);
        } else {
            this.delayPassed = true;
            this.startTime = performance.now() - (this.lastProgress * this.params.duration);
            this._animate();
        }
    }

    /**
     * Основной цикл анимации
     * @private
     */
    _animate() {
        if (!this.isAnimating || !this.delayPassed) return;

        const frameDuration = 1000 / this.params.fps;
        let lastFrameTime = this.startTime;

        const animate = (currentTime) => {
            const elapsedTime = currentTime - this.startTime;
            const progress = Math.min(elapsedTime / this.params.duration, 1);
            this.lastProgress = progress;
            const easedProgress = this.easing(progress);

            this.currentValue = this.params.start +
                (this.params.end - this.params.start) * easedProgress;
            this._updateDisplay();

            if (progress < 1) {
                const now = performance.now();
                const delta = now - lastFrameTime;

                if (delta >= frameDuration) {
                    lastFrameTime = now - (delta % frameDuration);
                    this.animationId = requestAnimationFrame(animate);
                } else {
                    this.animationId = requestAnimationFrame(animate);
                }
            } else {
                this._complete();
            }
        };

        this.animationId = requestAnimationFrame(animate);
    }

    /**
     * Останавливает анимацию
     * @returns {void}
     */
    stop() {
        if (!this.isAnimating) return;
        cancelAnimationFrame(this.animationId);
        this.isAnimating = false;
        this.delayPassed = false;
    }

    /**
     * Обновляет отображаемое значение в элементе
     * @private
     */
    _updateDisplay() {
        const formattedValue = this._formatNumber(this.currentValue);
        this.element.textContent = formattedValue;

        if (this.params.onUpdate) {
            this.params.onUpdate(formattedValue, this.currentValue);
        }
    }

    /**
     * Форматирует число согласно настройкам
     * @private
     * @param {number} value - Число для форматирования
     * @returns {string} Отформатированная строка
     */
    _formatNumber(value) {
        if (typeof this.params.format === 'function') {
            return this.params.prefix + this.params.format(value) + this.params.suffix;
        }

        if (this.params.locale) {
            const options = {
                minimumFractionDigits: this.params.decimals,
                maximumFractionDigits: this.params.decimals,
                ...this.params.formatOptions
            };

            if (this.params.currency) {
                options.style = 'currency';
                options.currency = this.params.currency;
            }

            const formatted = new Intl.NumberFormat(this.params.locale, options).format(value);
            return this.params.prefix + formatted + this.params.suffix;
        }

        let formatted = value.toFixed(this.params.decimals);

        if (this.params.thousandSeparator) {
            const parts = formatted.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.params.thousandSeparator);
            formatted = parts.join('.');
        }

        if (this.params.decimalSeparator && this.params.decimals > 0) {
            formatted = formatted.replace('.', this.params.decimalSeparator);
        }

        return this.params.prefix + formatted + this.params.suffix;
    }

    /**
     * Выполняет завершающие действия анимации
     * @private
     */
    _complete() {
        this.isAnimating = false;
        this.currentValue = this.params.end;
        this.lastProgress = 0;
        this._updateDisplay();

        if (this.params.onComplete) {
            this.params.onComplete();
        }
    }

    /**
     * Обновляет параметры анимации с возможностью плавного перехода
     * @param {Object} newParams - Новые параметры анимации
     * @returns {void}
     */
    updateParams(newParams) {
        const wasAnimating = this.isAnimating;
        this.stop();

        Object.assign(this.params, newParams);
        this.params.fps = Math.min(Math.max(this.params.fps, 12), 120);
        this._setup();

        if (wasAnimating) {
            this.params.start = this.currentValue;
            this.start();
        }
    }

    /**
     * Перезапускает анимацию с начального значения
     * @returns {void}
     */
    restart() {
        this.stop();
        this.lastProgress = 0;
        this.currentValue = this.params.start;
        this._updateDisplay();
        this.start();
    }

    /**
     * Уничтожает экземпляр, останавливает анимацию и Observer
     * @returns {void}
     */
    destroy() {
        this.stop();
        if (this.observer) {
            this.observer.unobserve(this.element);
            this.observer = null;
        }
    }
}

export default AnimateNumber;