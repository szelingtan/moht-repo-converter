class FormDataManager {
    constructor(categoryManager, partnerManager) {
        this.categoryManager = categoryManager;
        this.partnerManager = partnerManager;
    }

    collectFormData() {
        const mode = window.app?.modeManager?.getCurrentMode() || CONFIG.MODES.PROJECTS;
        const data = {
            category: this.sanitizeInput(this.categoryManager.getSelectedCategoriesString()),
            partners: this.sanitizeInput(this.partnerManager.getSelectedPartnersString())
        };
        
        // Check if we have project summary data populated (indicates parsed HTML or user input)
        const hasProjectSummaryData = this.hasProjectSummaryData();
        
        if (mode === CONFIG.MODES.PROJECTS || hasProjectSummaryData) {
            // Collect all fields if in Projects mode OR if project summary data exists (from parsing)
            Object.entries(FIELD_MAPPINGS.formToData).forEach(([fieldId, dataKey]) => {
                const element = document.getElementById(fieldId);
                if (element) {
                    data[dataKey] = this.sanitizeInput(element.value);
                }
            });
        } else {
            // Workflows mode with no parsed data: Only collect basic project details fields
            const workflowFields = ['title', 'poc', 'status'];
            workflowFields.forEach(fieldId => {
                const element = document.getElementById(fieldId);
                if (element) {
                    const dataKey = FIELD_MAPPINGS.formToData[fieldId] || fieldId;
                    data[dataKey] = this.sanitizeInput(element.value);
                }
            });
        }
        
        return data;
    }

    populateForm(data) {
        // Populate form fields
        Object.keys(data).forEach(key => {
            if (key === 'category') {
                // Handle multi-select category
                this.categoryManager.populate(data[key]);
            } else if (key === 'partners') {
                // Handle multi-select partners
                this.partnerManager.populate(data[key]);
            } else {
                const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
                if (element && data[key]) {
                    element.value = data[key];
                }
            }
        });
        
        // Special handling for camelCase field names using configuration
        Object.entries(FIELD_MAPPINGS.dataToForm).forEach(([dataKey, fieldId]) => {
            const element = document.getElementById(fieldId);
            if (element && data[dataKey]) {
                element.value = data[dataKey];
            }
        });
    }

    clearForm() {
        document.querySelector(SELECTORS.projectForm).reset();
        
        // Clear category and partner selections
        this.categoryManager.clear();
        this.partnerManager.clear();
        
        // Clear preview
        document.querySelector(SELECTORS.htmlPreview).innerHTML = '';
        document.querySelector(SELECTORS.htmlOutput).value = '';
    }

    hasFormData() {
        const formData = this.collectFormData();
        return Object.values(formData).some(value => value.trim() !== '');
    }

    validateForm() {
        const errors = [];
        const data = this.collectFormData();
        
        // Check required fields
        VALIDATION.required.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                errors.push(`${field} is required`);
            }
        });
        
        // Check email format
        VALIDATION.email.forEach(field => {
            if (data[field] && !this.isValidEmail(data[field])) {
                errors.push(`${field} must be a valid email address`);
            }
        });
        
        // Check field lengths
        Object.entries(VALIDATION.maxLength).forEach(([field, maxLength]) => {
            if (data[field] && data[field].length > maxLength) {
                errors.push(`${field} must be ${maxLength} characters or less`);
            }
        });
        
        Object.entries(VALIDATION.minLength).forEach(([field, minLength]) => {
            if (data[field] && data[field].length < minLength) {
                errors.push(`${field} must be at least ${minLength} characters`);
            }
        });
        
        return errors;
    }

    hasProjectSummaryData() {
        // Check if any project summary fields have data (indicates parsed HTML)
        const summaryFields = ['project-dates', 'sample-size', 'reason', 'objectives', 'stakeholders', 'interventions', 'outcomes'];
        return summaryFields.some(fieldId => {
            const element = document.getElementById(fieldId);
            return element && element.value.trim() !== '';
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Remove or escape potentially dangerous characters
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim();
    }
}