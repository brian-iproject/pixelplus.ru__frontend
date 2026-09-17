const YMAPS_SRC = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&coordorder=latlong';

// зазор между верхушкой метки и нижним краем балуна вместе с высотой самой метки
const BALLOON_GAP = 112;

let apiPromise = null;

/**
 * Загружаем API Яндекс.Карт один раз на страницу
 */
function loadYmaps() {
    if (apiPromise) return apiPromise;

    apiPromise = new Promise((resolve, reject) => {
        if (window.ymaps) {
            resolve(window.ymaps);
            return;
        }

        const script = document.createElement('script');
        script.src = YMAPS_SRC;
        script.async = true;
        script.onload = () => resolve(window.ymaps);
        script.onerror = () => reject(new Error('Не удалось загрузить API Яндекс.Карт'));
        document.head.appendChild(script);
    });

    return apiPromise;
}

class OfficeMap {

    constructor(root) {
        this.root = root;
        this.canvas = root.querySelector('[data-office-map-canvas]');
        this.tabsContainer = root.querySelector('[data-office-map-tabs]');
        this.routesContainer = root.querySelector('[data-office-map-routes]');
        this.qrImage = root.querySelector('[data-office-map-qr]');
        this.qrWrap = root.querySelector('[data-office-map-qr-wrap]');
        this.cardContainer = root.querySelector('[data-office-map-card]');
        this.offices = this.readOffices();

        if (!this.canvas || !this.offices.length) return;

        this.placemarks = {};
        this.activeOffice = this.officeByHash() || this.offices[0];
        this.setActiveTab(this.activeOffice);
        this.pin = this.canvas.dataset.pin || '';

        this.bindTabs();
        this.renderCard(this.activeOffice);
        this.updateRoutes(this.activeOffice);
        this.observe();
    }

    /**
     * Данные офисов лежат в разметке — их правит контент-менеджер, а не разработчик
     */
    readOffices() {
        const data = this.root.querySelector('[data-office-map-data]');
        if (!data) return [];

        return Array.from(data.querySelectorAll('[data-office]')).map((item) => {
            const coords = (item.dataset.coords || '').split(',').map((value) => parseFloat(value.trim()));
            const routes = {};

            Object.keys(item.dataset).forEach((key) => {
                if (!key.startsWith('route') || key === 'route') return;
                // data-route-2gis попадает в dataset как 'route-2gis' — дефис перед цифрой не схлопывается
                const name = key
                    .slice(5)
                    .replace(/^-/, '')
                    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
                    .toLowerCase();
                routes[name] = item.dataset[key];
            });

            return {
                id: item.dataset.office,
                anchors: (item.dataset.anchors || '').split(',').map((value) => value.trim()).filter(Boolean),
                coords,
                zoom: parseInt(item.dataset.zoom, 10) || 15,
                qr: item.dataset.qr || '',
                routes,
                content: item.innerHTML
            };
        }).filter((office) => office.coords.length === 2 && !Number.isNaN(office.coords[0]));
    }

    /**
     * Старые ссылки вида /contact/#zelenograd должны открывать вкладку нужного офиса
     */
    officeByHash() {
        const hash = decodeURIComponent(window.location.hash.replace('#', '')).toLowerCase();
        if (!hash) return null;

        return this.offices.find((office) => office.id === hash || office.anchors.includes(hash)) || null;
    }

    setActiveTab(office) {
        if (!this.tabsContainer) return;

        const tab = this.tabsContainer.querySelector(`[data-office="${office.id}"]`);
        if (!tab) return;

        this.tabsContainer.querySelectorAll('.-is-active').forEach((item) => item.classList.remove('-is-active'));
        tab.classList.add('-is-active');
    }

    bindTabs() {
        if (!this.tabsContainer) return;

        this.tabsContainer.addEventListener('click', (event) => {
            const tab = event.target.closest('[data-office]');
            if (!tab) return;

            const office = this.offices.find((item) => item.id === tab.dataset.office);
            if (!office) return;

            this.setActiveTab(office);

            this.activeOffice = office;
            this.updateRoutes(office);
            this.showOffice(office);
        });
    }

    /**
     * Ссылки «как доехать» и QR-код зависят от выбранного офиса
     */
    updateRoutes(office) {
        if (!this.routesContainer) return;

        this.routesContainer.querySelectorAll('[data-route]').forEach((link) => {
            const url = office.routes[link.dataset.route];
            const item = link.closest('li') || link;

            if (url) {
                link.href = url;
                item.hidden = false;
            } else {
                item.hidden = true;
            }
        });

        // QR-код есть не у каждого офиса — без него прячем всю плашку
        if (this.qrWrap) {
            this.qrWrap.hidden = !office.qr;
        }

        if (this.qrImage && office.qr) {
            this.qrImage.src = office.qr;
        }
    }

    /**
     * Карта грузится только когда пользователь до неё доскроллил
     */
    observe() {
        if (!('IntersectionObserver' in window)) {
            this.initMap();
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                this.initMap();
            });
        }, { rootMargin: '300px' });

        observer.observe(this.root);
    }

    initMap() {
        loadYmaps()
            .then((ymaps) => ymaps.ready(() => this.createMap(ymaps)))
            .catch(() => this.root.classList.add('office-map--failed'));
    }

    createMap(ymaps) {
        this.map = new ymaps.Map(this.canvas, {
            center: this.activeOffice.coords,
            zoom: this.activeOffice.zoom,
            controls: ['zoomControl', 'fullscreenControl']
        }, {
            suppressMapOpenBlock: true
        });

        this.map.behaviors.disable('scrollZoom');

        const balloonLayout = this.createBalloonLayout(ymaps);

        this.offices.forEach((office) => {
            const placemark = new ymaps.Placemark(office.coords, {
                balloonContent: office.content
            }, {
                iconLayout: 'default#image',
                iconImageHref: this.pin,
                iconImageSize: [62, 62],
                iconImageOffset: [-31, -62],
                balloonLayout,
                balloonPanelMaxMapArea: 0,
                balloonAutoPan: false,
                hideIconOnBalloonOpen: false
            });

            this.placemarks[office.id] = placemark;
            this.map.geoObjects.add(placemark);
        });

        this.showOffice(this.activeOffice);
    }

    isNarrow() {
        return window.matchMedia('(max-width: 991px)').matches;
    }

    /**
     * На узких экранах балун не помещается над меткой — карточку показываем отдельным блоком под картой
     */
    renderCard(office) {
        if (!this.cardContainer) return;

        this.cardContainer.innerHTML = office.content;
    }

    showOffice(office) {
        this.renderCard(office);

        if (!this.map) return;

        this.map.setCenter(office.coords, office.zoom);

        Object.keys(this.placemarks).forEach((id) => {
            if (id !== office.id) this.placemarks[id].balloon.close();
        });

        const placemark = this.placemarks[office.id];
        if (!placemark) return;

        if (this.isNarrow()) {
            placemark.balloon.close();
            return;
        }

        placemark.balloon.open().then(() => this.adjustCenter(office.coords));
    }

    /**
     * Метку опускаем настолько, чтобы раскрытый балун встал под тёмной шапкой и не спорил с ней
     */
    adjustCenter(coords) {
        const height = this.canvas.offsetHeight;
        if (height < 600) return;

        const overlay = this.root.querySelector('.office-map__overlay');
        const balloon = this.root.querySelector('.office-map-balloon__layout');
        const overlayHeight = overlay ? overlay.offsetHeight : 0;
        const balloonHeight = balloon ? balloon.offsetHeight : 240;

        // BALLOON_GAP — отступ метки от балуна, заданный в макете балуна
        const markerY = overlayHeight + BALLOON_GAP + balloonHeight;
        // лимит держит метку не ближе 50px к нижнему краю карты: при жёстком проценте
        // сдвиг урезался и балун наползал на кнопку в шапке
        const shift = Math.min(Math.max(markerY - height / 2, 0), height / 2 - 50);

        // в макете метка стоит правее центра — так балун не спорит с плашкой маршрутов слева
        const offsetX = Math.round(this.canvas.offsetWidth * 0.03);
        const pixelCenter = this.map.getGlobalPixelCenter(coords);
        this.map.setGlobalPixelCenter([pixelCenter[0] - offsetX, pixelCenter[1] - Math.round(shift)]);
    }

    /**
     * Свой макет балуна: карточка офиса из разметки плюс хвостик и крестик
     */
    createBalloonLayout(ymaps) {
        return ymaps.templateLayoutFactory.createClass(
            '<div class="office-map-balloon__layout">' +
                '$[properties.balloonContent]' +
                '<button class="office-map-balloon__close" type="button" aria-label="Закрыть"></button>' +
                '<div class="office-map-balloon__tail"></div>' +
            '</div>',
            {
                build() {
                    this.constructor.superclass.build.call(this);

                    this.element = this.getParentElement().querySelector('.office-map-balloon__layout');
                    if (!this.element) return;

                    this.closeHandler = (event) => {
                        event.preventDefault();
                        this.events.fire('userclose');
                    };

                    this.element
                        .querySelector('.office-map-balloon__close')
                        .addEventListener('click', this.closeHandler);

                    this.applyOffset();
                },

                clear() {
                    if (this.element) {
                        const close = this.element.querySelector('.office-map-balloon__close');
                        if (close) close.removeEventListener('click', this.closeHandler);
                    }

                    this.constructor.superclass.clear.call(this);
                },

                onSublayoutSizeChange() {
                    this.constructor.superclass.onSublayoutSizeChange.apply(this, arguments);
                    this.applyOffset();
                    this.events.fire('shapechange');
                },

                applyOffset() {
                    if (!this.element) return;

                    const tail = this.element.querySelector('.office-map-balloon__tail');
                    const tailHeight = tail ? tail.offsetHeight : 14;

                    // хвостик указывает в метку: смещаем балун так, чтобы он оказался над её верхушкой
                    this.element.style.left = '-52px';
                    this.element.style.top = `${-(this.element.offsetHeight + tailHeight + 88)}px`;
                },

                getShape() {
                    if (!this.element) {
                        return this.constructor.superclass.getShape.call(this);
                    }

                    const position = {
                        left: parseInt(this.element.style.left, 10) || 0,
                        top: parseInt(this.element.style.top, 10) || 0
                    };

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top],
                        [position.left + this.element.offsetWidth, position.top + this.element.offsetHeight]
                    ]));
                }
            }
        );
    }

    static init(selector = '[data-office-map]') {
        document.querySelectorAll(selector).forEach((root) => new OfficeMap(root));
    }
}

export default OfficeMap;
