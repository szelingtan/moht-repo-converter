class ModeManager {
    constructor() {
        this.currentMode = CONFIG.MODES.PROJECTS; // Default to Projects mode
    }

    toggleMode(mode) {
        this.currentMode = mode;
        this.updateUI();
        this.updateToggleButtons();
        
        // Trigger HTML regeneration
        this.forceHTMLGeneration();
    }

    updateUI() {
        const projectSummarySection = document.querySelector(SELECTORS.projectSummarySection);
        const projectDetailsTitle = document.querySelector(SELECTORS.projectDetailsTitle);
        
        if (this.currentMode === CONFIG.MODES.WORKFLOWS) {
            // Hide project summary section
            projectSummarySection.style.display = 'none';
            // Update title
            projectDetailsTitle.textContent = 'Workflow Details';
        } else {
            // Show project summary section
            projectSummarySection.style.display = 'block';
            // Restore title
            projectDetailsTitle.textContent = 'Project Details';
        }
    }

    updateToggleButtons() {
        const projectsBtn = document.querySelector(SELECTORS.modeProjectsButton);
        const workflowsBtn = document.querySelector(SELECTORS.modeWorkflowsButton);
        
        if (this.currentMode === CONFIG.MODES.PROJECTS) {
            projectsBtn.classList.add('active');
            workflowsBtn.classList.remove('active');
        } else {
            workflowsBtn.classList.add('active');
            projectsBtn.classList.remove('active');
        }
    }

    getCurrentMode() {
        return this.currentMode;
    }

    forceHTMLGeneration() {
        // Force HTML generation for mode changes, bypassing hasFormData check
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