class ToggleBlock {
    constructor(groupSelector) {
        this.groupSelector = groupSelector;

        document.querySelectorAll(groupSelector).forEach((item) => {
            item.addEventListener('click', this.clickHandler);
        })
    }

    clickHandler = (e) => {
        const toggleBtn = e.target.closest('[data-toggle]');
        if (!toggleBtn) return false;

        e.preventDefault();
        this.toggleBlock(toggleBtn);
    }

    getTargetBlock = (toggleBtn) => {
        return toggleBtn.closest(this.groupSelector).querySelector('[data-toggle-target=' + toggleBtn.dataset.toggle + ']');
    }

    toggleClass = (el, cssClass) => {
        el.classList.toggle(cssClass);
    }

    toggleBlock = (toggleBtn) => {
        const targetBlock = this.getTargetBlock(toggleBtn);
        this.toggleClass(toggleBtn, '-is-active');
        this.toggleClass(targetBlock, '-is-active');
    }

    static init(groupSelector) {
        if (!ToggleBlock[groupSelector]) {
            ToggleBlock[groupSelector] = new ToggleBlock(groupSelector);
        }
    }
}

export default ToggleBlock;