class MultiSelectCheckbox {
    static openInstances = new Set();

    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            type: 'checkbox', // 'checkbox' или 'radio'
            placeholder: 'Выберите',
            allText: 'Выбрать все',
            target: null,
            showCount: false,
            linkBy: 'value',
            emptyText: 'Нет выбранных элементов',
            searchable: false,
            searchPlaceholder: 'Поиск...',
            ...this.parseDataAttributes(),
            ...options
        };

        this.valueToTagMap = new Map();
        this.allInput = null;
        this.inputs = [];
        this.initialPlaceholder = this.options.placeholder;
        this.searchInput = null;
        this.isRadioMode = this.options.type === 'radio';

        this.initElements();
        this.initEvents();
        this.setAllInputText();
        this.updateSelection();
    }

    parseDataAttributes() {
        const options = {};

        if (this.container.hasAttribute('data-ms-type')) {
            options.type = this.container.dataset.msType;
        }

        if (this.container.hasAttribute('data-ms-placeholder')) {
            options.placeholder = this.container.dataset.msPlaceholder;
        }

        if (this.container.hasAttribute('data-ms-all-text')) {
            options.allText = this.container.dataset.msAllText;
        }

        if (this.container.hasAttribute('data-ms-target')) {
            options.target = this.container.dataset.msTarget;
        }

        if (this.container.hasAttribute('data-ms-show-count')) {
            options.showCount = this.container.dataset.msShowCount === 'true'
        }

        if (this.container.hasAttribute('data-ms-link-by')) {
            options.linkBy = this.container.dataset.msLinkBy
        }

        if (this.container.hasAttribute('data-ms-empty-text')) {
            options.emptyText = this.container.dataset.msEmptyText === '' ? null : this.container.dataset.msEmptyText
        }

        if (this.container.hasAttribute('data-ms-searchable')) {
            options.searchable = this.container.dataset.msSearchable === 'true';
        }

        if (this.container.hasAttribute('data-ms-search-placeholder')) {
            options.searchPlaceholder = this.container.dataset.msSearchPlaceholder;
        }

        return options;
    }

    initElements() {
        this.toggle = this.container.querySelector('.multiselect__toggle');
        this.dropdown = this.container.querySelector('.multiselect__dropdown');
        this.placeholder = this.container.querySelector('.multiselect__placeholder');

        this.allInput = this.container.querySelector('.multiselect__all');
        this.inputs = Array.from(
            this.container.querySelectorAll('.multiselect__input:not(.multiselect__all)')
        );

        // Определяем тип из атрибута type первого инпута, если не задано в options
        if (!this.options.type && this.inputs.length > 0) {
            const firstInput = this.inputs[0];
            this.options.type = firstInput.type || 'checkbox';
            this.isRadioMode = this.options.type === 'radio';
        }

        // Для radio
        if (this.isRadioMode && this.inputs.length > 0) {
           // const name = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
            let hasCheckedInput = false;
            this.inputs.forEach(input => {
                input.type = 'radio';
                if (!hasCheckedInput) {
                    hasCheckedInput = input.checked;
                }
                //input.name = name;
            });
            if (this.allInput) {
                this.allInput.type = 'radio';
                //this.allInput.name = name;

                // Выбираем "Все" по умолчанию
                if (!hasCheckedInput) {
                    this.allInput.checked = true;
                }
            }
        }

        this.target = this.options.target ? document.querySelector(this.options.target) : null;

        this.placeholder.textContent = this.initialPlaceholder;

        if (this.options.searchable) {
            this.initSearch();
        }
    }

    setAllInputText() {
        if (!this.allInput) return;

        const allLabel = this.allInput.nextElementSibling;
        if (allLabel) {
            allLabel.textContent = this.options.allText;
        }
    }

    initSearch() {
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.className = 'multiselect__search';
        this.searchInput.placeholder = this.options.searchPlaceholder;

        this.dropdown.insertBefore(this.searchInput, this.dropdown.firstChild);
    }

    initEvents() {
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) this.closeDropdown();
        });

        if (this.isRadioMode) {
            this.initRadioEvents();
        } else {
            this.initCheckboxEvents();
        }

        if (this.options.searchable && this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            this.searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    initCheckboxEvents() {
        this.inputs.forEach(input => {
            input.addEventListener('change', () => this.updateSelection());
        });

        if (this.allInput) {
            this.allInput.addEventListener('change', () => {
                this.inputs
                    .filter(input => !input.disabled && this.isInputVisible(input))
                    .forEach(input => {
                        input.checked = this.allInput.checked;
                    });
                this.updateSelection();
            });
        }
    }

    initRadioEvents() {
        this.inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.closeDropdown();
                this.updateSelection();
            });
        });

        if (this.allInput) {
            this.allInput.addEventListener('change', (e) => {
                this.closeDropdown();
                this.updateSelection();
            });
        }
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        this.inputs.forEach(input => {
            const label = input.nextElementSibling;
            const parent = input.closest('.multiselect__item');
            if (parent && label && label.textContent) {
                const text = label.textContent.toLowerCase();
                const isVisible = text.includes(term);
                parent.style.display = isVisible ? '' : 'none';
            }
        });

        if (this.allInput) {
            this.updateAllInputState();
        }
    }

    isInputVisible(input) {
        const parent = input.closest('.multiselect__item');
        return parent && parent.style.display !== 'none';
    }

    toggleDropdown() {
        MultiSelectCheckbox.openInstances.forEach(instance => {
            if (instance !== this) {
                instance.closeDropdown();
            }
        });

        this.dropdown.classList.toggle('show');
        this.toggle.classList.toggle('-is-active');

        if (this.dropdown.classList.contains('show') && this.options.searchable && this.searchInput) {
            setTimeout(() => {
                this.searchInput.focus();
            }, 0);
        }

        if (this.dropdown.classList.contains('show')) {
            MultiSelectCheckbox.openInstances.add(this);
        } else {
            MultiSelectCheckbox.openInstances.delete(this);
        }
    }

    closeDropdown() {
        this.dropdown.classList.remove('show');
        this.toggle.classList.remove('-is-active');

        if (this.options.searchable && this.searchInput) {
            this.searchInput.value = '';
            this.handleSearch('');
        }

        MultiSelectCheckbox.openInstances.delete(this);
    }

    getInputIdentifier(input) {
        switch(this.options.linkBy) {
            case 'name': return input.name;
            case 'id': return input.id;
            default: return input.value;
        }
    }

    updateSelection() {
        if (this.allInput) {
            if (this.isRadioMode) {
                this.updateRadioSelection();
            } else {
                this.updateAllInputState();
            }
        }

        if (this.target) {
            this.syncTags();
            this.updateEmptyState();
        }

        this.updatePlaceholder();
    }

    updateAllInputState() {
        if (this.isRadioMode) return;

        const enabledInputs = this.inputs.filter(input => !input.disabled && this.isInputVisible(input));
        const checkedCount = enabledInputs.filter(input => input.checked).length;

        this.allInput.checked = checkedCount === enabledInputs.length;
        this.allInput.indeterminate = checkedCount > 0 && checkedCount < enabledInputs.length;
        this.allInput.disabled = enabledInputs.length === 0;
    }

    updateRadioSelection() {
        // Для radio: если выбран "Все" - очищаем все теги
        if (this.allInput && this.allInput.checked) {
            this.clearTags();
        }
    }

    syncTags() {
        if (this.isRadioMode && this.allInput && this.allInput.checked) {
            // Если выбран "Все" - не показываем никакие теги
            return;
        }

        // Удаляем теги для снятых инпутов
        this.inputs
            .filter(input => {
                const identifier = this.getInputIdentifier(input);
                return !input.checked && this.valueToTagMap.has(identifier);
            })
            .forEach(input => {
                const identifier = this.getInputIdentifier(input);
                const tag = this.valueToTagMap.get(identifier);
                tag.remove();
                this.valueToTagMap.delete(identifier);
            });

        // Добавляем теги для новых выбранных инпутов
        this.inputs
            .filter(input => {
                const identifier = this.getInputIdentifier(input);
                return input.checked && !this.valueToTagMap.has(identifier);
            })
            .forEach(input => {
                const identifier = this.getInputIdentifier(input);
                const tag = this.createTag(input, identifier);

                const emptyMsg = this.target.querySelector('.multiselect-empty');
                if (emptyMsg) {
                    this.target.insertBefore(tag, emptyMsg);
                } else {
                    this.target.appendChild(tag);
                }

                this.valueToTagMap.set(identifier, tag);
            });
    }

    createTag(input, identifier) {
        const tag = document.createElement('div');
        tag.className = 'multiselect-tag';
        tag.dataset.msIdentifier = identifier;
        tag.innerHTML = `
                    ${input.nextElementSibling.querySelector('.multiselect__text').textContent}
                    <span class="multiselect-tag__remove" data-identifier="${identifier}"></span>
                `;

        tag.querySelector('.multiselect-tag__remove').addEventListener('click', (e) => {
            e.stopPropagation();

            if (this.isRadioMode) {
                this.allInput.click();
            } else {
                input.click();
            }

            this.updateSelection();
        });

        return tag;
    }

    hasCheckedInputs() {
        return this.inputs.some(input => input.checked) ||
            (this.allInput && this.allInput.checked);
    }

    updateEmptyState() {
        if (!this.target) return;

        const hasTags = this.target.querySelector('.multiselect-tag') !== null;
        const emptyMsg = this.target.querySelector('.multiselect-empty');

        // Для radio: если выбран "Все", считаем что есть выбранные элементы
        const hasSelection = this.isRadioMode ?
            (this.allInput && this.allInput.checked) || hasTags :
            hasTags;

        if (!hasSelection && !emptyMsg && this.options.emptyText !== null) {
            const emptyElement = document.createElement('div');
            emptyElement.className = 'multiselect-empty';
            emptyElement.textContent = this.options.emptyText;
            this.target.appendChild(emptyElement);
        } else if (hasSelection && emptyMsg) {
            emptyMsg.remove();
        }
    }

    updatePlaceholder() {
        if (this.isRadioMode) {
            this.updateRadioPlaceholder();
        } else {
            this.updateCheckboxPlaceholder();
        }
    }

    updateCheckboxPlaceholder() {
        const selectedCount = this.inputs.filter(input => input.checked).length;

        if (selectedCount === 0) {
            this.placeholder.textContent = this.initialPlaceholder;
        } else if (this.options.showCount) {
            this.placeholder.textContent = `${this.initialPlaceholder} (${selectedCount})`;
        } else {
            this.placeholder.textContent = this.initialPlaceholder;
        }
    }

    updateRadioPlaceholder() {
        let selectedText = this.initialPlaceholder;

        // Если выбран элемент "Все"
        if (this.allInput && this.allInput.checked) {
            this.placeholder.textContent = this.initialPlaceholder;
            return;
        }

        // Ищем выбранный радио-элемент
        const selectedInput = this.inputs.find(input => input.checked);
        if (selectedInput) {
            const label = selectedInput.nextElementSibling;
            if (label && label.textContent) {
                selectedText = label.textContent;
            }
        }

        this.placeholder.textContent = selectedText;
    }

    updateOptions(newOptions) {
        if (newOptions.linkBy && newOptions.linkBy !== this.options.linkBy) {
            this.clearTags();
        }

        this.options = {
            ...this.options,
            ...newOptions
        };

        // Обновляем флаг режима
        if (newOptions.type) {
            this.isRadioMode = newOptions.type === 'radio';
        }

        this.updateSelection();
    }

    clearTags() {
        if (!this.target) return;

        this.inputs.forEach(input => {
            const identifier = this.getInputIdentifier(input);
            if (this.valueToTagMap.has(identifier)) {
                const tag = this.valueToTagMap.get(identifier);
                tag.remove();
                this.valueToTagMap.delete(identifier);
            }
        });

        this.updateEmptyState();
    }
}

export default MultiSelectCheckbox;