class AcceptCookie {

    constructor({
        cookieName = 'ACCEPT_COOKIE',
        text = 'Оставаясь на сайте, вы соглашаетесь с использованием cookie-файлов и обработкой персональных данных.'
    }) {
        this.cookieName = cookieName;
        this.text = text;
        this.$messageContainer = null;
    }

    init = () => {
        if (Cookies.get(this.cookieName) !== 'Y') {
            this.createMessage();
        }
    }

    createMessage = () => {
        const $body = document.querySelector('body');
        this.$messageContainer = document.createElement('div');
        this.$messageContainer.classList.add('accept-cookie', 'page-container');

        const $containerInner = document.createElement('div');
        const $button = document.createElement('button');

        $containerInner.innerHTML = `<p>${this.text}</p>`;
        $containerInner.classList.add('accept-cookie__inner');

        $button.addEventListener('click', this.acceptHandler);
        $button.classList.add('button', 'button--not-fill');
        $button.innerText = 'Принимаю';

        $containerInner.append($button);
        this.$messageContainer.append($containerInner);
        $body.append(this.$messageContainer);
    }

    acceptHandler = (e) => {
        this.$messageContainer.classList.add('animate__animated', 'animate__fadeOut');
        Cookies.set(this.cookieName, 'Y', { path: '/' });

        this.$messageContainer.addEventListener('animationend', () => {
            this.$messageContainer.remove();
        });
    }
}

export default AcceptCookie;