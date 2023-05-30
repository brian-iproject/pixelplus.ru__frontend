class YtVideoLoad {
    static #instancesIndex = 0;
    static instances = [];

    constructor(video) {
        YtVideoLoad.#instancesIndex++;
        this.video = video;

        let link = video.querySelector('.yt-video__link');
        let id = this.parseMediaURL(link.href);

        video.addEventListener('click', (e) => {
            e.preventDefault();
            let iframe = this.createIframe(id);

            link.remove();
            video.appendChild(iframe);
        });
    }

    parseMediaURL = (url) => {
        let regexp = /https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i;
        let match = url.match(regexp);
        return match[1];
    }

    createIframe = (id) => {
        let iframe = document.createElement('iframe');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('src', this.generateURL(id));

        return iframe;
    }

    generateURL = (id) => {
        let query = '?rel=0&showinfo=0&autoplay=1';

        return 'https://www.youtube.com/embed/' + id + query;
    }

    static init = (options) => {
        if (!YtVideoLoad.instances[YtVideoLoad.#instancesIndex]) {
            YtVideoLoad.instances.push(new YtVideoLoad(options));
        }
    }
}

export default YtVideoLoad;