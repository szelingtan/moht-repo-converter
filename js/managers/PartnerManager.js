class PartnerManager {
    constructor() {
        this.selectedPartners = [];
        this.isUpdating = false;
        // Event listeners are now managed by EventManager
    }

    toggleDropdown() {
        const button = document.querySelector(SELECTORS.partnerButton);
        const dropdown = document.querySelector(SELECTORS.partnerDropdown);
        const container = button.closest('.multi-select-container');
        
        button.classList.toggle('active');
        dropdown.classList.toggle('open');
        
        // Add high z-index when open for proper layering
        if (dropdown.classList.contains('open')) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    }

    updateSelection() {
        if (this.isUpdating) return;
        this.isUpdating = true;
        
        const checkboxes = document.querySelectorAll(SELECTORS.partnerCheckboxes);
        const otherText = document.querySelector(SELECTORS.partnerOtherText);
        const otherCheckbox = document.querySelector(SELECTORS.partnerOtherCheckbox);
        
        this.selectedPartners = [];
        
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
        
        // Process predefined partner checkboxes (skip "Other" to avoid DOM timing issues)
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'Other') {
                this.selectedPartners.push(checkbox.value);
            }
        });
        
        // Include custom text in selections if it exists
        if (customText) {
            this.selectedPartners.push(customText);
        }
        
        this.updateDisplay();
        this.updateTags();
        this.isUpdating = false;
        
        // Force HTML regeneration for partner changes
        this.forceHTMLGeneration();
    }

    updateDisplay() {
        const display = document.querySelector(SELECTORS.partnerDisplay);
        
        if (this.selectedPartners.length === 0) {
            display.textContent = 'Select partners...';
        } else if (this.selectedPartners.length === 1) {
            display.textContent = this.selectedPartners[0];
        } else {
            display.textContent = `${this.selectedPartners.length} partners selected`;
        }
    }

    updateTags() {
        const tagsContainer = document.querySelector(SELECTORS.partnerTags);
        tagsContainer.innerHTML = '';
        
        this.selectedPartners.forEach((partner, index) => {
            const tag = document.createElement('div');
            tag.className = 'category-tag';
            tag.innerHTML = `
                ${partner}
                <button type="button" class="remove-tag" data-index="${index}" title="Remove">×</button>
            `;
            
            // Event handling is now managed by EventManager
            // No need to add individual event listeners here
            
            tagsContainer.appendChild(tag);
        });
    }

    removePartner(index) {
        const partnerToRemove = this.selectedPartners[index];
        this.selectedPartners.splice(index, 1);
        
        const predefinedPartners = CONFIG.PREDEFINED_PARTNERS;
        
        if (predefinedPartners.includes(partnerToRemove)) {
            // Uncheck the corresponding predefined checkbox
            const checkbox = document.querySelector(`#partner-dropdown input[value="${partnerToRemove}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
        } else {
            // This was a custom partner from "Other"
            const hasOtherCustomPartners = this.selectedPartners.some(partner => !predefinedPartners.includes(partner));
            
            if (!hasOtherCustomPartners) {
                // No more custom partners, uncheck "Other" and clear/disable text input
                document.querySelector(SELECTORS.partnerOtherCheckbox).checked = false;
                document.querySelector(SELECTORS.partnerOtherText).value = '';
                document.querySelector(SELECTORS.partnerOtherText).disabled = true;
            }
        }
        
        this.updateDisplay();
        this.updateTags();
        
        // Force HTML regeneration for partner changes
        this.forceHTMLGeneration();
    }

    populate(partnerString) {
        // Clear current selections
        this.selectedPartners = [];
        const checkboxes = document.querySelectorAll(SELECTORS.partnerCheckboxes);
        checkboxes.forEach(cb => cb.checked = false);
        document.querySelector(SELECTORS.partnerOtherText).value = '';
        document.querySelector(SELECTORS.partnerOtherText).disabled = true;
        
        if (!partnerString) return;
        
        // Split partners by comma and trim whitespace
        const partners = partnerString.split(',').map(partner => partner.trim()).filter(partner => partner);
        const predefinedPartners = CONFIG.PREDEFINED_PARTNERS;
        
        partners.forEach(partner => {
            if (predefinedPartners.includes(partner)) {
                // Check the predefined partner
                const checkbox = document.querySelector(`#partner-dropdown input[value="${partner}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    this.selectedPartners.push(partner);
                }
            } else {
                // This is a custom partner - check "Other" and set the text
                const otherCheckbox = document.querySelector(SELECTORS.partnerOtherCheckbox);
                const otherText = document.querySelector(SELECTORS.partnerOtherText);
                otherCheckbox.checked = true;
                otherText.value = partner;
                otherText.disabled = false;
                this.selectedPartners.push(partner);
            }
        });
        
        this.updateDisplay();
        this.updateTags();
    }

    clear() {
        this.selectedPartners = [];
        const checkboxes = document.querySelectorAll(SELECTORS.partnerCheckboxes);
        checkboxes.forEach(cb => cb.checked = false);
        document.querySelector(SELECTORS.partnerOtherText).value = '';
        document.querySelector(SELECTORS.partnerOtherText).disabled = true;
        this.updateDisplay();
        this.updateTags();
    }

    getSelectedPartners() {
        return this.selectedPartners.slice(); // Return a copy
    }

    getSelectedPartnersString() {
        return this.selectedPartners.join(', ');
    }

    forceHTMLGeneration() {
        // Force HTML generation for partner changes, bypassing hasFormData check
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