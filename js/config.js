// Configuration Constants
const CONFIG = {
    PREDEFINED_CATEGORIES: ['Admission', 'Inpatient', 'Discharge', 'Workflows'],
    PREDEFINED_PARTNERS: ['Acute Hospitals', 'Within Community Hospital', 'Community Partners'],
    STATUS_OPTIONS: ['Planning', 'Standard Care', 'Ongoing', 'Discontinued'],
    AUTO_GENERATE_DELAY: 500,
    SUCCESS_MESSAGE_DURATION: 3000,
    ERROR_MESSAGE_DURATION: 5000,
    
    // Mode configuration
    MODES: {
        PROJECTS: 'projects',
        WORKFLOWS: 'workflows'
    }
};

// DOM Selectorsi
const SELECTORS = {
    // Category elements
    categoryButton: '#category-button',
    categoryDropdown: '#category-dropdown',
    categoryDisplay: '#category-display',
    categoryTags: '#category-tags',
    categoryOtherText: '#category-other-text',
    categoryOtherCheckbox: '#cat-other',
    categoryCheckboxes: '#category-dropdown input[type="checkbox"]',
    
    // Partner elements
    partnerButton: '#partner-button',
    partnerDropdown: '#partner-dropdown',
    partnerDisplay: '#partner-display',
    partnerTags: '#partner-tags',
    partnerOtherText: '#partner-other-text',
    partnerOtherCheckbox: '#partner-other',
    partnerCheckboxes: '#partner-dropdown input[type="checkbox"]',
    
    // Mode toggle elements
    modeToggleContainer: '#mode-toggle-container',
    modeProjectsButton: '#mode-projects',
    modeWorkflowsButton: '#mode-workflows',
    projectDetailsSection: '#project-details-section',
    projectSummarySection: '#project-summary-section',
    projectDetailsTitle: '#project-details-title',
    
    // Form elements
    projectForm: '#project-form',
    formElements: '#project-form input, #project-form select, #project-form textarea',
    
    // Preview elements
    htmlPreview: '#html-preview',
    htmlOutput: '#html-output',
    htmlInput: '#html-input',
    
    // Message elements
    parseError: '#parse-error',
    
    // Tab elements
    tabContents: '.tab-content',
    tabButtons: '.tab-button'
};

// Field Mappings
const FIELD_MAPPINGS = {
    formToData: {
        'title': 'title',
        'poc': 'poc',
        'partners': 'partners',
        'status': 'status',
        'project-dates': 'projectDates',
        'sample-size': 'sampleSize',
        'reason': 'reason',
        'objectives': 'objectives',
        'stakeholders': 'stakeholders',
        'interventions': 'interventions',
        'outcomes': 'outcomes'
    },
    dataToForm: {
        'projectDates': 'project-dates',
        'sampleSize': 'sample-size'
    },
    htmlToField: {
        'title': 'title',
        'poc': 'poc',
        'partners': 'partners',
        'category': 'category',
        'status': 'status',
        'project dates': 'projectDates',
        'sample size': 'sampleSize',
        'reason for action': 'reason',
        'aim / objective': 'objectives',
        'aim/objective': 'objectives',
        'stakeholders': 'stakeholders',
        'interventions': 'interventions',
        'outcomes': 'outcomes'
    }
};

// Table Styles
const TABLE_STYLES = {
    base: 'width:100%; border-collapse: collapse; font-family: Arial, sans-serif;',
    headerDetails: 'background-color:#E6E6FA;',
    headerSummary: 'background-color:#ADD8E6;',
    cell: 'border: 1px solid #ddd; padding: 12px; font-size: 14px;',
    headerCell: 'width:25%; border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px;',
    headerCellWide: 'width:75%; border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px;',
    evenRow: 'background-color:#f2f2f2;',
    list: 'margin:0; padding-left:20px;'
};

// Validation Rules
const VALIDATION = {
    required: ['title', 'objectives', 'reason'],
    email: ['poc'],
    maxLength: {
        'title': 200,
        'partners': 500,
        'poc': 100,
        'reason': 1000,
        'objectives': 2000,
        'stakeholders': 1000,
        'interventions': 3000,
        'outcomes': 3000
    },
    minLength: {
        'title': 3,
        'objectives': 10,
        'reason': 10
    }
};