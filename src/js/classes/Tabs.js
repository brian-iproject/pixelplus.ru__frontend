class Tabs {
    static #instances = 0;
    static el = [];

    constructor(tabContainer, tabPanelContainer) {
        Tabs.#instances++;
        if (typeof tabContainer == 'object') {
            this.tabContainer = tabContainer;
        } else {
            this.tabContainer = document.querySelector(tabContainer);
        }

        if (typeof tabPanelContainer === 'object') {
            this.tabPanelContainer = tabPanelContainer;
        } else {
            this.tabPanelContainer = document.querySelector(tabPanelContainer);
        }

        if (this.tabContainer === null || this.tabPanelContainer === null)
            return;

        this.setTabIndex();
        this.openTab(0);

        this.tabContainer.addEventListener('click', event => {
            const tab = event.target.closest('[data-tab-index]');
            if (tab === null)
                return false;
            const index = tab.dataset.tabIndex;

            this.openTab(index);
        });
    }

    /**
     * Проставляем индексы табов
     */
    setTabIndex() {
        const tabList = this.tabContainer.children;
        const tabPanelList = this.tabPanelContainer.children;

        let tabIndex = 0;

        for (let tab of tabList) {
            tab.setAttribute('data-tab-index', tabIndex);
            if (tabPanelList[tabIndex])
                tabPanelList[tabIndex].setAttribute('data-tabpanel-index', tabIndex);
            tabIndex ++;
        }
    }

    /**
     * Открываем таб с выбранным индексом
     * @param index
     */
    openTab(index) {
        let tabActive = this.tabContainer.querySelector('.-is-active');
        let tabPanelActive;

        let tabPanels = this.tabPanelContainer.children;
        for (let tabPanel of tabPanels) {
            if (tabPanel.classList.contains('-is-active')) {
                tabPanelActive = tabPanel;
            }
        }

        if (tabActive)
            tabActive.classList.remove('-is-active');
        if (tabPanelActive)
            tabPanelActive.classList.remove('-is-active');

        this.tabContainer.querySelector(`[data-tab-index = "${index}"]`).classList.add('-is-active');
        this.tabPanelContainer.querySelector(`[data-tabpanel-index = "${index}"]`).classList.add('-is-active');
    }

    static init = (tabContainer, tabPanelContainer) => {
        if (!Tabs.el[Tabs.#instances]) {
            Tabs.el.push(new Tabs(tabContainer, tabPanelContainer));
        }
    }
}

export default Tabs;