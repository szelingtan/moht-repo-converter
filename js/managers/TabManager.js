class TabManager {
    showTab(tabName, targetElement = null) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll(SELECTORS.tabContents);
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        // Remove active class from all tab buttons
        const tabButtons = document.querySelectorAll(SELECTORS.tabButtons);
        tabButtons.forEach(button => button.classList.remove('active'));
        
        // Show selected tab content
        document.getElementById(tabName).classList.add('active');
        
        // Add active class to clicked tab button if provided
        if (targetElement) {
            targetElement.classList.add('active');
        }
    }

    showTabByName(tabName) {
        // Find the tab button and trigger click
        const tabButtons = document.querySelectorAll(SELECTORS.tabButtons);
        tabButtons.forEach(button => {
            if (button.textContent.includes('Form to HTML') && tabName === 'form-to-html') {
                button.click();
            }
        });
    }
}