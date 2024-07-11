class AcceptCookie {

    constructor(config = {}) {
        const defaultConfig = {
            cookie: {
                name: 'ACCEPT_COOKIE',
                time: 365
            },
            container: {
                class: 'accept-cookie',
                addClass: null,
            },
            button: {
                text: 'Принимаю',
                class: 'button',
            },
            text: 'Оставаясь на сайте, вы соглашаетесь с использованием cookie-файлов и обработкой персональных данных.',
            showModal: false,
            on: {
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
            },
            container: {
                ...defaultConfig.container,
                ...config.container
            },
            button: {
                ...defaultConfig.button,
                ...config.button
            },
            on: {
                ...defaultConfig.on,
                ...config.on
            }
        }

        if (!this._checkCookie()) {
            this.config.on.beforeSet();
            if (this.config.showModal && typeof Fancybox !== 'undefined') {
                this._showModal();
            } else {
                this._showMessage();
            }
        } else {
            this.config.on.afterSet();
        }
    }

    _showModal = () => {
        Fancybox.show([{
            src: this.config.text,
            type: "html"
        }], {
            dragToClose: false,
            click: null,
            mainClass: 'modal-fancybox',
            on : {
                closing: () => {
                    this._close();
                }
            }
        });
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

    _showMessage = () => {
        const   body = document.querySelector('body'),
                container = this._createMessage();
        body.append(container);
    }

    _createMessage = () => {
        const   container = document.createElement('div'),
                containerInner = document.createElement('div'),
                button = document.createElement('button');

        container.classList.add(this.config.container.class);

        if (this.config.container.addClass) {
            let addClass = this.config.container.addClass.split(' ');
            addClass.forEach((item) => {
                container.classList.add(item);
            });
        }

        containerInner.classList.add(`${this.config.container.class}__inner`);
        containerInner.innerHTML = this.config.text;

        let buttonClass = this.config.button.class.split(' ');
        buttonClass.forEach((item) => {
            button.classList.add(item);
        });
        button.classList.add(`${this.config.container.class}__button`);
        button.innerText = this.config.button.text;

        button.addEventListener('click', () => {
            this._close(container)
        });

        containerInner.append(button);
        container.append(containerInner);

        return container;
    }

    _close = (container = null) => {
        if (container) {
            const animation = container.animate({
                opacity: [1, 0]
            }, {
                duration: 400,
                easing: 'ease-out'
            });
            animation.onfinish = () => {
                container.remove();
            };
        }
        this._setCookie();
        this.config.on.afterClose();
    }
}

export default AcceptCookie;