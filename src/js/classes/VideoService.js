class VideoService {
    constructor() {

    }

    static getVkVideo = (url) => {
        let result = url.match(/(vk\.com|vk\.ru|vkvideo\.ru)\/(video|clip)(-?)((\d+)_(\d+))/);
        if (!result) return false;

        return `https://${result[1]}/video_ext.php?oid=${result[3]}${result[5]}&id=${result[6]}&hd=2`;
    }

    static getYouTubeVideo = (url) => {
        let result = url.match("^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?\.com|youtu\.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)");
        if (!result) return false;

        return `https://www.youtube.com/embed/${result[1]}?rel=0&showinfo=0`;
    }

    static getRutubeVideo = (url) => {
        let result = url.match("^(?:https?:)?//[^/]*rutube.ru\/video\/([a-z0-9]+)");
        if (!result) return false;

        return `https://rutube.ru/pl/?pl_video=${result[1]}`;
    }

    static getLocalVideo = (url) => {
        let result = url.match("^("+ window.location.origin + ")?(\/(upload|assets)\/(.+).mp4)");
        if (!result) return false;

        return url;
    }
}

export default VideoService;