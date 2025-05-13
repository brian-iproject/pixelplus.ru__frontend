class StoriesVideo {

    constructor(container, config = {}) {
        this.container = container;
        this.video = null;
        this.isActive = false;
        this.buttonOrder = this.container.querySelector('.stories-video__button');

        const defaultConfig = {
            useCookie: true,
            videoURL: this.container.dataset.video,
            buttonDelay: container.dataset.buttonDelay ? container.dataset.buttonDelay : 0,
            cookie: {
                name: 'STORIES_VIDEO',
                time: 365
            },
            on: {
                afterInit: () => {},
                afterSet: () => {},
                afterClose: () => {}
            }
        };

        this.config = {
            ...defaultConfig,
            ...config,
            cookie: {
                ...defaultConfig.cookie,
                ...config.cookie
            }
        };

        if (this.config.useCookie && this._checkCookie()) {
            this._remove();
        } else {
            this._init();
            this.config.on.afterInit(this.container);
        }

        this.container.removeAttribute('data-video');
    }

    _init = () => {
        this._create();
        this.video.addEventListener('click', this._onSwitchingView);
    }


    _setCookie = () => {
        const cookieTime = new Date(Date.now() + this.config.cookie.time * 24 * 60 * 60 * 1000);

        if (typeof Cookies !== 'undefined') {
            Cookies.set(
                this.config.cookie.name,
                true,
                {
                    path: '/',
                    expires: cookieTime
                }
            );
        } else {
            document.cookie = `${this.config.cookie.name}=true; expires=${cookieTime}; path=/`;
        }

        this.config.on.afterSet();
    }

    _checkCookie = () => {
        if (typeof Cookies !== 'undefined') {
            return Cookies.get(this.config.cookie.name);
        } else {
            return document.cookie.includes(this.config.cookie.name);
        }
    }

    _create = () => {
        const   $video = document.createElement('video'),
                $source = document.createElement('source'),
                $shrink = document.createElement('button'),
                $close = document.createElement('button');
                //$order = document.createElement('button');

        $video.autoplay = true;
        $video.muted = true;
        $video.loop = true;
        $video.preload = 'auto';
        $video.setAttribute('playsinline', '');
        $video.setAttribute('webkit-playinginline', '');
        $source.src = this.config.videoURL;
        $source.type = 'video/mp4';
        $video.append($source);

        this.video = $video;

        $shrink.classList.add('stories-video__shrink');
        $close.classList.add('stories-video__close');
        $close.innerHTML = `<svg class="icon"><use href="#close"></use></svg>`;
        // $order.classList.add('stories-video__button', 'button', 'button--primary', 'button--small', 'js-order');
        // $order.dataset.theme = 'SEO'
        // $order.innerText = 'Узнать подробнее'

        this.container.append($video);
        this.container.append($shrink);
        this.container.append($close);
        //this.container.append($order);

        $shrink.addEventListener('click', this._onSwitchingView);
        $close.addEventListener('click', this._onClose);

        this.container.style.opacity = 1;
    }

    _onTimeUpdate = () => {
        if (this.isActive && this.video.currentTime > this.config.buttonDelay) {
            this.buttonOrder.classList.add('-is-active');
        }
    }

    _onSwitchingView = (e) => {
        e.stopPropagation();

        this.container.classList.toggle('-is-active');
        this.isActive = this.container.classList.contains('-is-active');

        this.video.muted = !this.isActive;
        this.video.loop = !this.isActive;

        if (this.isActive) {
            this.video.currentTime = 0;
            this.video.addEventListener('timeupdate', this._onTimeUpdate);
        } else {
            this.video.removeEventListener('timeupdate', this._onTimeUpdate);
            this.buttonOrder.classList.remove('-is-active');
        }
    }

    _remove = () =>  this.container.remove();

    _onClose = () => {
        this._remove();
        this.config.on.afterClose();
        if (this.config.useCookie) {
            this._setCookie();
        }
    }
}

export default StoriesVideo;