class CategoryManager {
    constructor() {
        this.selectedCategories = [];
        this.isUpdating = false;
        // Event listeners are now managed by EventManager
    }

    toggleDropdown() {
        const button = document.querySelector(SELECTORS.categoryButton);
        const dropdown = document.querySelector(SELECTORS.categoryDropdown);
        const container = button.closest('.multi-select-container');
        const projectDetailsSection = document.querySelector('#project-details-section');
        
        button.classList.toggle('active');
        dropdown.classList.toggle('open');
        
        // Add high z-index when open for proper layering
        if (dropdown.classList.contains('open')) {
            container.classList.add('active');
            // Boost entire project details section above project summary
            projectDetailsSection?.classList.add('dropdown-active');
        } else {
            container.classList.remove('active');
            projectDetailsSection?.classList.remove('dropdown-active');
        }
    }

    updateSelection() {
        if (this.isUpdating) return;
        this.isUpdating = true;
        
        const checkboxes = document.querySelectorAll(SELECTORS.categoryCheckboxes);
        const otherText = document.querySelector(SELECTORS.categoryOtherText);
        const otherCheckbox = document.querySelector(SELECTORS.categoryOtherCheckbox);
        
        this.selectedCategories = [];
        
        // Capture states
        const customText = otherText.value.trim();
        const otherCurrentlyChecked = otherCheckbox.checked;
        
        // Handle "Other" checkbox logic
        if (customText && !otherCurrentlyChecked) {
            // User unchecked "Other" but text exists - clear text and keep unchecked
            otherText.value = '';
            otherText.disabled = true;
        } else if (otherCurrentlyChecked) {
            // "Other" is checked - enable text input regardless of current text
            otherText.disabled = false;
        } else {
            // "Other" is not checked - disable text input
            otherText.disabled = true;
        }
        
        // Process predefined category checkboxes (skip "Other" to avoid DOM timing issues)
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'Other') {
                this.selectedCategories.push(checkbox.value);
            }
        });
        
        // Include custom text in selections if it exists
        if (customText) {
            this.selectedCategories.push(customText);
        }
        
        this.updateDisplay();
        this.updateTags();
        this.isUpdating = false;
        
        // Force HTML regeneration for category changes
        this.forceHTMLGeneration();
    }

    updateDisplay() {
        const display = document.querySelector(SELECTORS.categoryDisplay);
        
        if (this.selectedCategories.length === 0) {
            display.textContent = 'Select categories...';
        } else if (this.selectedCategories.length === 1) {
            display.textContent = this.selectedCategories[0];
        } else {
            display.textContent = `${this.selectedCategories.length} categories selected`;
        }
    }

    updateTags() {
        const tagsContainer = document.querySelector(SELECTORS.categoryTags);
        tagsContainer.innerHTML = '';
        
        this.selectedCategories.forEach((category, index) => {
            const tag = document.createElement('div');
            tag.className = 'category-tag';
            tag.innerHTML = `
                ${category}
                <button type="button" class="remove-tag" data-index="${index}" title="Remove">×</button>
            `;
            
            // Event handling is now managed by EventManager
            // No need to add individual event listeners here
            
            tagsContainer.appendChild(tag);
        });
    }

    removeCategory(index) {
        const categoryToRemove = this.selectedCategories[index];
        this.selectedCategories.splice(index, 1);
        
        const predefinedCategories = CONFIG.PREDEFINED_CATEGORIES;
        
        if (predefinedCategories.includes(categoryToRemove)) {
            // Uncheck the corresponding predefined checkbox
            const checkbox = document.querySelector(`#category-dropdown input[value="${categoryToRemove}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
        } else {
            // This was a custom category from "Other"
            const hasOtherCustomCategories = this.selectedCategories.some(cat => !predefinedCategories.includes(cat));
            
            if (!hasOtherCustomCategories) {
                // No more custom categories, uncheck "Other" and clear/disable text input
                document.querySelector(SELECTORS.categoryOtherCheckbox).checked = false;
                document.querySelector(SELECTORS.categoryOtherText).value = '';
                document.querySelector(SELECTORS.categoryOtherText).disabled = true;
            }
        }
        
        this.updateDisplay();
        this.updateTags();
        
        // Force HTML regeneration for category changes
        this.forceHTMLGeneration();
    }

    populate(categoryString) {
        // Clear current selections
        this.selectedCategories = [];
        const checkboxes = document.querySelectorAll(SELECTORS.categoryCheckboxes);
        checkboxes.forEach(cb => cb.checked = false);
        document.querySelector(SELECTORS.categoryOtherText).value = '';
        document.querySelector(SELECTORS.categoryOtherText).disabled = true;
        
        if (!categoryString) return;
        
        // Split categories by comma and trim whitespace
        const categories = categoryString.split(',').map(cat => cat.trim()).filter(cat => cat);
        const predefinedCategories = CONFIG.PREDEFINED_CATEGORIES;
        
        categories.forEach(category => {
            if (predefinedCategories.includes(category)) {
                // Check the predefined category
                const checkbox = document.querySelector(`#category-dropdown input[value="${category}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    this.selectedCategories.push(category);
                }
            } else {
                // This is a custom category - check "Other" and set the text
                const otherCheckbox = document.querySelector(SELECTORS.categoryOtherCheckbox);
                const otherText = document.querySelector(SELECTORS.categoryOtherText);
                otherCheckbox.checked = true;
                otherText.value = category;
                otherText.disabled = false;
                this.selectedCategories.push(category);
            }
        });
        
        this.updateDisplay();
        this.updateTags();
    }

    clear() {
        this.selectedCategories = [];
        const checkboxes = document.querySelectorAll(SELECTORS.categoryCheckboxes);
        checkboxes.forEach(cb => cb.checked = false);
        document.querySelector(SELECTORS.categoryOtherText).value = '';
        document.querySelector(SELECTORS.categoryOtherText).disabled = true;
        this.updateDisplay();
        this.updateTags();
    }

    getSelectedCategories() {
        return this.selectedCategories.slice(); // Return a copy
    }

    getSelectedCategoriesString() {
        return this.selectedCategories.join(', ');
    }

    forceHTMLGeneration() {
        // Force HTML generation for category changes, bypassing hasFormData check
        if (window.app && typeof window.app.generateHTML === 'function') {
            // Clear any pending debounced calls
            if (window.app.eventManager && window.app.eventManager.autoGenerateTimeout) {
                clearTimeout(window.app.eventManager.autoGenerateTimeout);
            }
            
            // Small delay to ensure DOM state is synchronized
            setTimeout(() => {
                window.app.generateHTML();
            }, 50);
        }
    }
}