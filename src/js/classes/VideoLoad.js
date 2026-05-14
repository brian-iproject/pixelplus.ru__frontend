import VideoService from "./VideoService.js";
class VideoLoad {
    static #instancesIndex = 0;
    static instances = [];

    constructor(video) {
        VideoLoad.#instancesIndex++;

        this.video = video;
        this.link = video.querySelector('.yt-video__link');
        if (video.querySelector('img.yt-video__media')) {
            this.poster = video.querySelector('img.yt-video__media').src;
        }

        if (!this.link) return false;

        this.url = this.link.href;
        this.host = new URL(this.url).host

        if (!this.poster) {
            this.loadVideo({ autoplay: false });
        }

        if (this.url) {
            this.link.addEventListener('click', (e) => {
                e.preventDefault();

                this.loadVideo({ autoplay: true });
            });
        }
    }

    loadVideo = (options) => {
        let html = this.getVideoHtml(options);
        if (html) {
            this.link.remove();
            this.video.appendChild(html);
        } else {
            window.open(this.url)
        }
    }

    getVideoHtml = (options) => {
        let iframeSrc = VideoService.getVkVideo(this.url) ||
            VideoService.getYouTubeVideo(this.url) ||
            VideoService.getRutubeVideo(this.url),
        localSrc = VideoService.getLocalVideo(this.url);

        if (iframeSrc) {
            let iframe = document.createElement('iframe');

            iframe.setAttribute('allowfullscreen', '');
            if (options.autoplay) {
                iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture;');
            } else {
                iframe.setAttribute('allow', 'encrypted-media; fullscreen; picture-in-picture;');
            }

            iframe.setAttribute('src', iframeSrc);

            return iframe;
        } else if (localSrc) {
            let video = document.createElement('video'),
                source = document.createElement('source');

            video.setAttribute('controls', '');
            if (this.poster) {
                video.setAttribute('poster', this.poster);
            }
            if (options.autoplay) {
                video.setAttribute('autoplay', '');
            }
            source.setAttribute('src', localSrc);

            video.appendChild(source);

            return video;
        } else {
            return false;
        }
    }

    static init = (options) => {
        if (!VideoLoad.instances[VideoLoad.#instancesIndex]) {
            VideoLoad.instances.push(new VideoLoad(options));
        }
    }
}

export default VideoLoad;