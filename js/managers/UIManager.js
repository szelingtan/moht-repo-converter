class UIManager {
    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showToast(message, type = 'success') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            toastContainer.style.position = 'fixed';
            toastContainer.style.top = '20px';
            toastContainer.style.right = '20px';
            toastContainer.style.zIndex = '10000';
            toastContainer.style.display = 'flex';
            toastContainer.style.flexDirection = 'column';
            toastContainer.style.gap = '10px';
            toastContainer.style.pointerEvents = 'none';
            document.body.appendChild(toastContainer);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Apply inline styles to ensure they work
        toast.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)';
        toast.style.borderRadius = '16px';
        toast.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)';
        toast.style.backdropFilter = 'blur(20px)';
        toast.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        toast.style.minWidth = '320px';
        toast.style.maxWidth = '420px';
        toast.style.transform = 'translateX(450px)';
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        toast.style.pointerEvents = 'auto';
        toast.style.position = 'relative';
        toast.style.overflow = 'hidden';
        
        toast.innerHTML = `
            <div class="toast-content" style="display: flex; align-items: center; gap: 16px; padding: 20px 24px; position: relative;">
                <span class="toast-icon" style="font-size: 20px; font-weight: bold; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;">${type === 'success' ? '✓' : '⚠'}</span>
                <span class="toast-message" style="color: #1f2937; font-weight: 600; line-height: 1.5; flex: 1; font-size: 15px;">${message}</span>
            </div>
        `;

        // Add top border
        const topBorder = document.createElement('div');
        topBorder.style.position = 'absolute';
        topBorder.style.top = '0';
        topBorder.style.left = '0';
        topBorder.style.right = '0';
        topBorder.style.height = '4px';
        topBorder.style.background = type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
        toast.appendChild(topBorder);

        // Add to container
        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.opacity = '1';
        }, 10);

        // Remove after duration
        setTimeout(() => {
            toast.style.transform = 'translateX(450px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, CONFIG.SUCCESS_MESSAGE_DURATION || 3000);
    }

    showErrorMessage(message) {
        const errorElement = document.querySelector(SELECTORS.parseError);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            setTimeout(() => {
                errorElement.classList.remove('show');
            }, CONFIG.ERROR_MESSAGE_DURATION);
        } else {
            alert(message); // Fallback
        }
    }

    copyToClipboard(text) {
        this.showLoadingState('copy-html', 'Copying...');
        
        // Check if modern clipboard API is available
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).then(() => {
                this.hideLoadingState('copy-html', 'Copy HTML');
                this.showSuccessMessage('HTML copied to clipboard!');
            }).catch(() => {
                this.hideLoadingState('copy-html', 'Copy HTML');
                // Fallback to legacy method
                this.fallbackCopyToClipboard(text);
            });
        } else {
            // Use fallback method for older browsers
            this.hideLoadingState('copy-html', 'Copy HTML');
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        try {
            // Create a temporary textarea
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            
            textArea.focus();
            textArea.select();
            
            // Try to copy using execCommand
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                this.showSuccessMessage('HTML copied to clipboard!');
            } else {
                throw new Error('Copy command failed');
            }
        } catch (error) {
            // Final fallback - show the text in a dialog
            this.showErrorMessage('Unable to copy automatically. Please manually copy the HTML from the text area below.');
            
            // Select the HTML output textarea content
            const htmlOutput = document.querySelector(SELECTORS.htmlOutput);
            if (htmlOutput) {
                htmlOutput.focus();
                htmlOutput.select();
            }
        }
    }

    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('HTML file downloaded!');
    }

    copyHTML() {
        const htmlOutput = document.querySelector(SELECTORS.htmlOutput);
        if (htmlOutput.value.trim()) {
            this.copyToClipboard(htmlOutput.value);
        } else {
            this.showErrorMessage('No HTML to copy. Please generate HTML first.');
        }
    }

    downloadHTML() {
        const htmlOutput = document.querySelector(SELECTORS.htmlOutput).value;
        if (!htmlOutput) {
            this.showErrorMessage('No HTML to download. Please generate HTML first.');
            return;
        }
        
        this.downloadFile(htmlOutput, 'moht-project-report.html');
    }

    clearHTMLInput() {
        document.querySelector(SELECTORS.htmlInput).value = '';
        document.querySelector(SELECTORS.parseError).classList.remove('show');
    }

    showValidationErrors(errors) {
        // Show general error message
        const errorMessage = `Please fix the following errors:\n• ${errors.join('\n• ')}`;
        this.showErrorMessage(errorMessage);
        
        // Add field-level error indicators
        errors.forEach(error => {
            const fieldName = error.split(' ')[0].toLowerCase();
            this.addFieldError(fieldName);
        });
    }

    addFieldError(fieldName) {
        // Find the field element
        const fieldElement = document.getElementById(fieldName) || 
                           document.getElementById(fieldName.replace(/([A-Z])/g, '-$1').toLowerCase());
        
        if (fieldElement) {
            fieldElement.classList.add('error');
            
            // Add error styling if not already present
            if (!fieldElement.classList.contains('error-added')) {
                fieldElement.classList.add('error-added');
                fieldElement.style.borderColor = '#dc2626';
                fieldElement.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
            }
        }
    }

    clearFieldErrors() {
        // Remove error classes and styling from all form fields
        const formFields = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        formFields.forEach(field => {
            field.classList.remove('error', 'error-added');
            field.style.borderColor = '';
            field.style.boxShadow = '';
        });
    }

    hideErrorMessage() {
        const errorElement = document.querySelector(SELECTORS.parseError);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    showLoadingState(buttonAction, loadingText) {
        const button = document.querySelector(`[data-action="${buttonAction}"]`);
        if (button) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
            button.classList.add('loading');
        }
    }

    hideLoadingState(buttonAction, originalText) {
        const button = document.querySelector(`[data-action="${buttonAction}"]`);
        if (button) {
            button.disabled = false;
            button.textContent = originalText || button.dataset.originalText || button.textContent;
            button.classList.remove('loading');
            delete button.dataset.originalText;
        }
    }
}