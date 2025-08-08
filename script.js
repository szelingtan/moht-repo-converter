// Global variables
let currentFormData = {};

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab button
    event.target.classList.add('active');
}

// Form to HTML functionality
function generateHTML() {
    const formData = collectFormData();
    const htmlOutput = createHTMLTables(formData);
    
    // Update preview
    document.getElementById('html-preview').innerHTML = htmlOutput;
    document.getElementById('html-output').value = htmlOutput;
    
    // Store current form data
    currentFormData = formData;
    
    // Show success message briefly
    showSuccessMessage('HTML generated successfully!');
}

function collectFormData() {
    return {
        title: document.getElementById('title').value,
        poc: document.getElementById('poc').value,
        partners: document.getElementById('partners').value,
        intent: document.getElementById('intent').value,
        status: document.getElementById('status').value,
        projectDates: document.getElementById('project-dates').value,
        sampleSize: document.getElementById('sample-size').value,
        reason: document.getElementById('reason').value,
        objectives: document.getElementById('objectives').value,
        stakeholders: document.getElementById('stakeholders').value,
        interventions: document.getElementById('interventions').value,
        outcomes: document.getElementById('outcomes').value
    };
}

function createHTMLTables(data) {
    const projectDetailsTable = `<h3>Project Details:</h3>
<table style="width:100%; border-collapse: collapse; font-family: Arial, sans-serif;">
  <tr style="background-color:#E6E6FA;">
    <th style="width:25%; border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px;">Category</th>
    <th style="width:75%; border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px;">Details</th>
  </tr>
  <tr style="background-color:#f2f2f2;">
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Title</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">${data.title}</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>POC</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">${data.poc ? `<a href="mailto:${data.poc}">${data.poc}</a>` : ''}</td>
  </tr>
  <tr style="background-color:#f2f2f2;">
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Partners</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">${data.partners}</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Intent</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">${data.intent}</td>
  </tr>
  <tr style="background-color:#f2f2f2;">
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Status</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">${data.status}</td>
  </tr>
</table>`;

    const projectSummaryTable = `<h3>Project Summary:</h3>
<table style="width:100%; border-collapse: collapse; font-family: Arial, sans-serif;">
  <tr style="background-color:#ADD8E6;">
    <th style="width:25%; border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px;">Category</th>
    <th style="width:75%; border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 14px;">Details</th>
  </tr>
  <tr style="background-color:#f2f2f2;">
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Project Dates</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">${data.projectDates}</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Sample Size</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">${data.sampleSize}</td>
  </tr>
  <tr style="background-color:#f2f2f2;">
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Reason for Action</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">${data.reason}</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Aim / Objective</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">
      ${formatAsList(data.objectives, 'ul')}
    </td>
  </tr>
  <tr style="background-color:#f2f2f2;">
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Stakeholders</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">${data.stakeholders}</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Interventions</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">
      ${formatAsList(data.interventions, 'ol')}
    </td>
  </tr>
  <tr style="background-color:#f2f2f2;">
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;"><b>Outcomes</b></td>
    <td style="border: 1px solid #ddd; padding: 12px; font-size: 14px;">
      ${formatAsList(data.outcomes, 'ol')}
    </td>
  </tr>
</table>`;

    return projectDetailsTable + projectSummaryTable;
}

function formatAsList(text, listType) {
    if (!text) return '';
    
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length <= 1) {
        return text; // Return as plain text if only one line or less
    }
    
    const listItems = lines.map(line => {
        // Remove any existing numbering or bullets
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '').trim();
        return `<li>${cleanLine}</li>`;
    }).join('');
    
    return `<${listType} style="margin:0; padding-left:20px;">${listItems}</${listType}>`;
}

function clearForm() {
    document.getElementById('project-form').reset();
    document.getElementById('html-preview').innerHTML = '';
    document.getElementById('html-output').value = '';
    currentFormData = {};
}

function copyHTML() {
    const htmlOutput = document.getElementById('html-output');
    if (htmlOutput.value) {
        navigator.clipboard.writeText(htmlOutput.value).then(() => {
            showSuccessMessage('HTML copied to clipboard!');
        }).catch(err => {
            showErrorMessage('Failed to copy HTML to clipboard');
        });
    } else {
        showErrorMessage('No HTML to copy. Please generate HTML first.');
    }
}

function downloadHTML() {
    const htmlOutput = document.getElementById('html-output').value;
    if (!htmlOutput) {
        showErrorMessage('No HTML to download. Please generate HTML first.');
        return;
    }
    
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moht-project-report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccessMessage('HTML file downloaded!');
}

// HTML to Form functionality
function parseHTML() {
    const htmlInput = document.getElementById('html-input').value.trim();
    if (!htmlInput) {
        showErrorMessage('Please paste HTML code first.');
        return;
    }
    
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlInput, 'text/html');
        
        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid HTML format');
        }
        
        const extractedData = extractDataFromHTML(doc);
        populateForm(extractedData);
        
        // Switch to form tab
        showTabByName('form-to-html');
        
        showSuccessMessage('HTML parsed successfully! Form has been populated.');
        
    } catch (error) {
        showErrorMessage('Error parsing HTML: ' + error.message);
    }
}

function extractDataFromHTML(doc) {
    const data = {};
    
    // Extract data from tables
    const tables = doc.querySelectorAll('table');
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const category = cells[0].textContent.trim().replace(/\*$/, ''); // Remove asterisk
                const details = cells[1];
                
                // Map categories to form fields
                switch (category.toLowerCase()) {
                    case 'title':
                        data.title = details.textContent.trim();
                        break;
                    case 'poc':
                        const emailLink = details.querySelector('a[href^="mailto:"]');
                        data.poc = emailLink ? emailLink.textContent.trim() : details.textContent.trim();
                        break;
                    case 'partners':
                        data.partners = details.textContent.trim();
                        break;
                    case 'intent':
                        data.intent = details.textContent.trim();
                        break;
                    case 'status':
                        data.status = details.textContent.trim();
                        break;
                    case 'project dates':
                        data.projectDates = details.textContent.trim();
                        break;
                    case 'sample size':
                        data.sampleSize = details.textContent.trim();
                        break;
                    case 'reason for action':
                        data.reason = details.textContent.trim();
                        break;
                    case 'aim / objective':
                    case 'aim/objective':
                        data.objectives = extractListContent(details);
                        break;
                    case 'stakeholders':
                        data.stakeholders = details.textContent.trim();
                        break;
                    case 'interventions':
                        data.interventions = extractListContent(details);
                        break;
                    case 'outcomes':
                        data.outcomes = extractListContent(details);
                        break;
                }
            }
        });
    });
    
    return data;
}

function extractListContent(element) {
    const list = element.querySelector('ul, ol');
    if (list) {
        const items = list.querySelectorAll('li');
        return Array.from(items).map(item => item.textContent.trim()).join('\n');
    }
    return element.textContent.trim();
}

function populateForm(data) {
    // Populate form fields
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (element && data[key]) {
            element.value = data[key];
        }
    });
    
    // Special handling for camelCase field names
    const fieldMappings = {
        'project-dates': data.projectDates,
        'sample-size': data.sampleSize
    };
    
    Object.keys(fieldMappings).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element && fieldMappings[fieldId]) {
            element.value = fieldMappings[fieldId];
        }
    });
    
    // Auto-generate preview
    generateHTML();
}

function clearHTMLInput() {
    document.getElementById('html-input').value = '';
    document.getElementById('parse-error').classList.remove('show');
}

// Utility functions
function showTabByName(tabName) {
    // Find the tab button and trigger click
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        if (button.textContent.includes('Form to HTML') && tabName === 'form-to-html') {
            button.click();
        }
    });
}

function showSuccessMessage(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;
    
    // Find the appropriate container
    const activeTab = document.querySelector('.tab-content.active');
    const container = activeTab.querySelector('.form-actions') || activeTab.querySelector('.preview-controls');
    
    if (container) {
        container.appendChild(successDiv);
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

function showErrorMessage(message) {
    const errorElement = document.getElementById('parse-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);
    } else {
        alert(message); // Fallback
    }
}

// Auto-generate HTML when form fields change
document.addEventListener('DOMContentLoaded', function() {
    const formElements = document.querySelectorAll('#project-form input, #project-form select, #project-form textarea');
    
    formElements.forEach(element => {
        element.addEventListener('input', function() {
            // Debounced auto-generation
            clearTimeout(this.autoGenerateTimeout);
            this.autoGenerateTimeout = setTimeout(() => {
                if (hasFormData()) {
                    generateHTML();
                }
            }, 500);
        });
    });
});

function hasFormData() {
    const formData = collectFormData();
    return Object.values(formData).some(value => value.trim() !== '');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state
    showTab('form-to-html');
    
    // Add event listeners for better UX
    const form = document.getElementById('project-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            generateHTML();
        });
    }
});

// Sample data function for user guide
function loadSampleData() {
    // Sample data based on the original example
    const sampleData = {
        title: 'Enhancing Transfers to Community Hospitals via Fast Track & Communication Redesign',
        poc: 'li_huan_teo@ttsh.com.sg',
        partners: 'Acute hospitals',
        intent: 'Admission',
        status: 'Standard Care',
        projectDates: 'October 2018 - March 2019',
        sampleSize: 'From General Medicine and Geriatric Medicine disciplines only, to hospital wide roll-out by October 2018.',
        reason: 'About 5% of TTSH patients are discharged to Community Hospitals (CH) for rehabilitation and recovery - delay in transfers affect acute beds availability.',
        objectives: `Reduce transfer wait time to Community Hospital (CH) by eliminating duplicated work processes and reducing multiple re-work / clarifications process
Increase uptake to CH by increasing awareness on CH capabilities
Lower healthcare utilization costs by reducing unnecessary acute hospital bed days`,
        stakeholders: 'TTSH, AMKCH, RCCH, AIC, students from Nanyang Polytechnic',
        interventions: `Process Optimization: Value Stream Mapping was conducted to optimize processes. There was established joint agreement on clinical inclusion and exclusion criteria, common EMR platform (bypassing Medical/PT/OT reports eliminated duplication during referral submission in AIC-IRMS)
Shared Ownership: operations model was reframed, from work-in-silos to shared ownership. CH partners under Data Sharing Agreement could obtain necessary information directly from shared clinical documentation system to facilitate referral process. Dialysis referral flows were also harmonized in April 2019
Transfer Criteria: Transfer criteria were fine-tuned to enable medically and socially straightforward cases to be fast tracked
Enhancing Communications on CH: Partnered students from Nanyang Polytechnic to develop communication strategies which focused on showcasing the capabilities of CHs to build the confidence and understanding of service users about CHs`,
        outcomes: `Fast track cases achieved 3 days transfer wait time (reduction of 46%), and non-fast track cases achieved 4.8 days transfer wait time (reduction of 12%), as compared to 5.5 days previously, contributing to a total of 2007 bed-days avoided over 24 weeks, equivalent to overall healthcare cost avoidance of $2,007,000
Increase in healthcare professionals' productivity by reducing the multiple re-work, resulting in a reduction of 30 minutes to prepare a referral application, saving up to 0.3 FTE per year
Increase in number of discharges to community hospitals
Enabled the cluster eco-system to strengthen its coordination and reframed its modus operandi from working-in-silos to shared ownership`
    };
    
    // Populate form fields
    Object.keys(sampleData).forEach(key => {
        const fieldId = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = sampleData[key];
        }
    });
    
    // Handle special field mappings
    document.getElementById('project-dates').value = sampleData.projectDates;
    document.getElementById('sample-size').value = sampleData.sampleSize;
    
    // Switch to form tab and generate HTML
    showTabByName('form-to-html');
    generateHTML();
    
    // Show success message
    showSuccessMessage('Sample data loaded successfully! Check out the form and preview.');
}
