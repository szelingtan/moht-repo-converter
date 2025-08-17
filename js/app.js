// Global application instance
let app;

// Legacy function wrappers - kept for backward compatibility
// EventManager now handles all events directly, but these may still be called programmatically
function toggleCategoryDropdown() {
    if (app) app.categoryManager.toggleDropdown();
}

function updateCategorySelection() {
    if (app) app.categoryManager.updateSelection();
}


function clearForm() {
    if (app) app.formDataManager.clearForm();
}

function copyHTML() {
    if (app) app.uiManager.copyHTML();
}

function downloadHTML() {
    if (app) app.uiManager.downloadHTML();
}

function parseHTML() {
    if (app) app.parseHTML();
}

function clearHTMLInput() {
    if (app) app.uiManager.clearHTMLInput();
}

function loadSampleData() {
    if (app) app.loadSampleData();
}

function showTab(tabName) {
    if (app) app.tabManager.showTab(tabName);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Create the main application instance
    app = new MOHTProjectConverter();
    
    // Make app available globally for EventManager and other components
    window.app = app;
    
    // Set initial state - show the form-to-html tab
    app.tabManager.showTab('form-to-html');
    
    // Initialize mode UI to ensure proper display state
    app.modeManager.updateUI();
});