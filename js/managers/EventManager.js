class EventManager {
    constructor(app) {
        this.app = app;
        this.boundHandlers = new Map();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Use event delegation for better performance and cleanup
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('change', this.handleChange.bind(this));
        document.addEventListener('input', this.handleInput.bind(this));
        document.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Special handlers that need direct binding
        this.initializeSpecialHandlers();
    }

    handleClick(event) {
        const target = event.target;
        const action = target.dataset.action || target.getAttribute('onclick');
        console.log('Click detected:', target.className, target.tagName, target.dataset); // Debug log
        
        // Handle tab buttons
        if (target.classList.contains('tab-button')) {
            event.preventDefault();
            const tabName = this.extractTabName(target);
            if (tabName) {
                this.app.tabManager.showTab(tabName, target);
            }
            return;
        }

        // Handle category dropdown
        if (target.id === 'category-button' || target.closest('#category-button')) {
            event.preventDefault();
            this.app.categoryManager.toggleDropdown();
            return;
        }

        // Handle partner dropdown
        if (target.id === 'partner-button' || target.closest('#partner-button')) {
            event.preventDefault();
            this.app.partnerManager.toggleDropdown();
            return;
        }

        // Handle mode toggle buttons
        if (target.id === 'mode-projects') {
            event.preventDefault();
            this.app.modeManager.toggleMode(CONFIG.MODES.PROJECTS);
            return;
        }

        if (target.id === 'mode-workflows') {
            event.preventDefault();
            this.app.modeManager.toggleMode(CONFIG.MODES.WORKFLOWS);
            return;
        }

        // Handle clicks on "Other" option headers to toggle checkbox
        if (target.classList.contains('category-option-header') || target.closest('.category-option-header')) {
            const header = target.classList.contains('category-option-header') ? target : target.closest('.category-option-header');
            const checkbox = header.querySelector('input[type="checkbox"]');
            if (checkbox && !target.matches('input[type="checkbox"]')) {
                // Only toggle if we didn't click the checkbox directly
                checkbox.checked = !checkbox.checked;
                // Trigger change event
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                event.preventDefault();
                return;
            }
        }

        // Handle remove tag buttons (both category and partner)
        if (target.classList.contains('remove-tag')) {
            event.preventDefault();
            event.stopPropagation();
            const index = parseInt(target.dataset.index);
            console.log('Remove tag clicked, index:', index); // Debug log
            if (!isNaN(index)) {
                // Determine if this is a category or partner tag
                const isPartnerTag = target.closest('#partner-tags');
                if (isPartnerTag) {
                    this.app.partnerManager.removePartner(index);
                } else {
                    this.app.categoryManager.removeCategory(index);
                }
                // Trigger immediate HTML regeneration
                this.app.generateHTML();
            }
            return;
        }

        // Handle form action buttons
        const buttonActions = {
            'clear-form': () => this.app.formDataManager.clearForm(),
            'copy-html': () => this.app.uiManager.copyHTML(),
            'download-html': () => this.app.uiManager.downloadHTML(),
            'parse-html': () => this.app.parseHTML(),
            'clear-html-input': () => this.app.uiManager.clearHTMLInput(),
            'load-sample-data': () => this.app.loadSampleData()
        };

        // Check for data-action attribute first
        if (target.dataset.action && buttonActions[target.dataset.action]) {
            event.preventDefault();
            buttonActions[target.dataset.action]();
            return;
        }

        // Fallback: check for inline onclick and extract function name
        const onclickAttr = target.getAttribute('onclick');
        if (onclickAttr) {
            event.preventDefault();
            const functionName = this.extractFunctionName(onclickAttr);
            if (buttonActions[this.camelToKebab(functionName)]) {
                buttonActions[this.camelToKebab(functionName)]();
            } else {
                // Handle legacy function calls
                this.handleLegacyFunction(functionName);
            }
            return;
        }

        // Handle outside clicks to close dropdowns only for unhandled clicks
        this.handleOutsideDropdownClicks(target);
    }

    handleOutsideDropdownClicks(target) {
        // Don't close dropdowns if clicking on dropdown buttons or their children
        if (target.id === 'category-button' || target.closest('#category-button') ||
            target.id === 'partner-button' || target.closest('#partner-button')) {
            return;
        }

        // Close category dropdown if clicking outside
        const categoryContainer = document.querySelector(SELECTORS.categoryButton)?.closest('.multi-select-container');
        const categoryButton = document.querySelector(SELECTORS.categoryButton);
        const categoryDropdown = document.querySelector(SELECTORS.categoryDropdown);
        
        if (categoryContainer && !categoryContainer.contains(target)) {
            categoryButton?.classList.remove('active');
            categoryDropdown?.classList.remove('open');
            categoryContainer?.classList.remove('active');
            // Remove boost from project details section
            document.querySelector('#project-details-section')?.classList.remove('dropdown-active');
        }

        // Close partner dropdown if clicking outside
        const partnerContainer = document.querySelector(SELECTORS.partnerButton)?.closest('.multi-select-container');
        const partnerButton = document.querySelector(SELECTORS.partnerButton);
        const partnerDropdown = document.querySelector(SELECTORS.partnerDropdown);
        
        if (partnerContainer && !partnerContainer.contains(target)) {
            partnerButton?.classList.remove('active');
            partnerDropdown?.classList.remove('open');
            partnerContainer?.classList.remove('active');
        }
    }

    handleChange(event) {
        const target = event.target;
        
        // Handle category checkbox changes
        if (target.type === 'checkbox' && target.closest('#category-dropdown')) {
            this.app.categoryManager.updateSelection();
            return; // Prevent falling through to form auto-generation
        }

        // Handle partner checkbox changes
        if (target.type === 'checkbox' && target.closest('#partner-dropdown')) {
            this.app.partnerManager.updateSelection();
            return; // Prevent falling through to form auto-generation
        }

        // Handle category other text input
        if (target.id === 'category-other-text') {
            this.app.categoryManager.updateSelection();
            return; // Prevent falling through to form auto-generation
        }

        // Handle partner other text input
        if (target.id === 'partner-other-text') {
            this.app.partnerManager.updateSelection();
            return; // Prevent falling through to form auto-generation
        }
        
        // Handle other form field changes for auto-generation
        if (target.closest('#project-form')) {
            this.debounceAutoGenerate();
            return;
        }
    }

    handleInput(event) {
        const target = event.target;
        
        // Handle category other text input
        if (target.id === 'category-other-text') {
            this.app.categoryManager.updateSelection();
            return;
        }
        
        // Handle partner other text input
        if (target.id === 'partner-other-text') {
            this.app.partnerManager.updateSelection();
            return;
        }
        
        // Handle form field inputs for auto-generation
        if (target.closest('#project-form')) {
            this.debounceAutoGenerate();
            return;
        }
    }

    handleSubmit(event) {
        // Handle form submission
        if (event.target.id === 'project-form') {
            event.preventDefault();
            this.app.generateHTML();
        }
    }

    initializeSpecialHandlers() {
        // Initialize debounced auto-generation
        this.autoGenerateTimeout = null;
        
        // Handle clicks outside category dropdown
        this.initializeCategoryOutsideClick();
    }

    initializeCategoryOutsideClick() {
        // This logic is now handled by handleOutsideDropdownClicks()
        // No additional event listener needed
    }

    debounceAutoGenerate() {
        clearTimeout(this.autoGenerateTimeout);
        this.autoGenerateTimeout = setTimeout(() => {
            if (this.app.formDataManager.hasFormData()) {
                this.app.generateHTML();
            }
        }, CONFIG.AUTO_GENERATE_DELAY);
    }

    extractTabName(button) {
        const text = button.textContent.trim().toLowerCase();
        if (text.includes('form to html')) return 'form-to-html';
        if (text.includes('html to form')) return 'html-to-form';
        if (text.includes('user guide')) return 'user-guide';
        return null;
    }

    extractFunctionName(onclickAttr) {
        // Extract function name from onclick="functionName()"
        const match = onclickAttr.match(/^(\w+)\s*\(/);
        return match ? match[1] : null;
    }

    camelToKebab(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }

    handleLegacyFunction(functionName) {
        // Handle legacy function calls that don't map to button actions
        const legacyMappings = {
            'toggleCategoryDropdown': () => this.app.categoryManager.toggleDropdown(),
            'updateCategorySelection': () => this.app.categoryManager.updateSelection(),
            'clearForm': () => this.app.formDataManager.clearForm(),
            'copyHTML': () => this.app.uiManager.copyHTML(),
            'downloadHTML': () => this.app.uiManager.downloadHTML(),
            'parseHTML': () => this.app.parseHTML(),
            'clearHTMLInput': () => this.app.uiManager.clearHTMLInput(),
            'loadSampleData': () => this.app.loadSampleData(),
            'showTab': (tabName) => this.app.tabManager.showTab(tabName)
        };

        if (legacyMappings[functionName]) {
            legacyMappings[functionName]();
        }
    }

    // Cleanup method for when the app is destroyed
    destroy() {
        document.removeEventListener('click', this.handleClick.bind(this));
        document.removeEventListener('change', this.handleChange.bind(this));
        document.removeEventListener('input', this.handleInput.bind(this));
        document.removeEventListener('submit', this.handleSubmit.bind(this));
        
        // Clear any pending timeouts
        if (this.autoGenerateTimeout) {
            clearTimeout(this.autoGenerateTimeout);
        }
        
        this.boundHandlers.clear();
    }
}