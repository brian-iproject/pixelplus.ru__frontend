class Like {

    constructor(el, url, config = {}) {
        const defaultConfig = {
            useCookie: false,
            cookie: {
                name: 'TEAM_LIKE',
                time: 365
            },
        }

        this.el = el;
        this.config = {
            ...defaultConfig,
            ...config,
            cookie: {
                ...defaultConfig.cookie,
                ...config.cookie
            },
        }
        this.url = url;
        this.button = el.querySelector('[data-id]')
        this.id = this._getId();

        el.addEventListener('click', (e) => this._onClick(e));

        if (this.config.useCookie) {
            if (this._checkCookie()) {
                this.button.disabled = true;
                this.button.classList.add();
            }
        }

        this._getCountLike().then(result => {
            if (result['ALERT_TEXT']) {
                alert(result['ALERT_TEXT']);
                return false
            }
            if (result['PROPERTY_LIKE_VALUE']) {
                this.el.querySelector('[data-counter]').innerText = result['PROPERTY_LIKE_VALUE'];
            }
        });
    }

    _setCookie = (json) => {
        const cookieTime = new Date(Date.now() + this.config.cookie.time * 24 * 60 * 60 * 1000);
        Cookies.set(
            this.config.cookie.name,
            json,
            {
                path: '/',
                expires: cookieTime
            }
        );
    }

    _getCookie = () => {
        return Cookies.get(this.config.cookie.name);
    }

    _checkCookie() {
        let idList = this._getCookie();
        if (!idList) return false;

        idList.includes(this._getId());
        return idList.includes(this._getId());
    }

    _getCookieIdArray() {
        return JSON.parse(this._getCookie());
    }

    _getId() {
        return this.button.dataset.id
    }

    async _sendRequest(action) {
        const data = {
            id: this.id,
            action: action
        }

        const response = await fetch(this.url, {
            method: "POST",
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.status !== 200) {
            throw new Error("Ошибка чтения файла. Код: " + response.status);
        }
        return await response.json();
    }

    async _getCountLike() {
        return await this._sendRequest('get');
    }

    async _setCountLike() {
        return await this._sendRequest('set')
    }

    async _onClick() {
        this._setCountLike().then(result => {
            if (result['ALERT_TEXT']) {
                alert(result['ALERT_TEXT']);
                return false;
            }

            if (result['PROPERTY_LIKE_VALUE']) {
                this.el.querySelector('[data-counter]').innerText = result['PROPERTY_LIKE_VALUE'];

                if (this.config.useCookie) {
                    let idList = this._getCookie() ? this._getCookieIdArray() : [];

                    if (!this._checkCookie()) {
                        idList.push(this._getId());
                        this._setCookie(JSON.stringify(idList));
                    }
                    this.button.disabled = true;
                }
            }
        });
    }
}

export default Like;