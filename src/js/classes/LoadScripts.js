class LoadScripts {
    constructor(data = [], config = {}) {
        if (!data.length) return false;

        const defaultConfig = {
            uaSearchBotCustom: false
        };

        this.config = Object.assign(defaultConfig, config);
        this.data = data;

        if (!this._isSearchSystemBotSigns()) {
            this._loadScript();
        }
    }

    _loadScript = () => {
        this.data.forEach((item, index) => {
            const area = document.querySelector(item.areaSelector);
            if (area) {
                area.append(document.createRange().createContextualFragment(item['html']));
            }
        });
    }

    _isSearchSystemBotSigns = () => {
        let uaList = [
            'APIs-Google', 'Mediapartners-Google', 'AdsBot-Google-Mobile', 'AdsBot-Google', 'Googlebot', 'AdsBot-Google-Mobile-Apps',
            'YandexBot', 'YandexMobileBot', 'YandexDirectDyn', 'YandexScreenshotBot', 'YandexImages', 'YandexVideo', 'YandexVideoParser',
            'YandexMedia', 'YandexBlogs', 'YandexFavicons', 'YandexWebmaster', 'YandexPagechecker', 'YandexImageResizer', 'YandexAdNet',
            'YandexDirect', 'YaDirectFetcher', 'YandexCalendar', 'YandexSitelinks', 'YandexMetrika', 'YandexNews', 'YandexCatalog',
            'YandexMarket', 'YandexVertis', 'YandexForDomain', 'YandexSpravBot', 'YandexSearchShop', 'YandexMedianaBot', 'YandexOntoDB',
            'YandexOntoDBAPI', 'YandexVerticals', 'Mail.RU_Bot', 'StackRambler', 'Yahoo', 'msnbot', 'bingbot', 'PixelTools', 'PixelBot'
        ];
        if (this.config.uaSearchBotCustom) {
            uaList.push(...this.config.uaSearchBotCustom);
        }

        let sUsrAg = navigator.userAgent;
        return !!uaList.find(item => sUsrAg.includes(item));
    }
}

export default LoadScripts;