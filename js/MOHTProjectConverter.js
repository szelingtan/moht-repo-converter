class MOHTProjectConverter {
    constructor() {
        this.categoryManager = new CategoryManager();
        this.partnerManager = new PartnerManager();
        this.modeManager = new ModeManager();
        this.formDataManager = new FormDataManager(this.categoryManager, this.partnerManager);
        this.htmlGenerator = new HTMLGenerator();
        this.htmlParser = new HTMLParser();
        this.uiManager = new UIManager();
        this.tabManager = new TabManager();
        this.eventManager = new EventManager(this);
        this.currentFormData = {};
    }

    generateHTML() {
        try {
            const formData = this.formDataManager.collectFormData();
            const htmlOutput = this.htmlGenerator.createHTMLTables(formData);
            
            // Update preview
            document.querySelector(SELECTORS.htmlPreview).innerHTML = htmlOutput;
            document.querySelector(SELECTORS.htmlOutput).value = htmlOutput;
            
            // Store current form data
            this.currentFormData = formData;
        } catch (error) {
            console.error('Error generating HTML preview:', error.message);
            // Don't show error messages for real-time preview generation
        }
    }


    parseHTML() {
        const htmlInput = document.querySelector(SELECTORS.htmlInput).value.trim();
        if (!htmlInput) {
            this.uiManager.showErrorMessage('Please paste HTML code first.');
            return;
        }
        
        this.uiManager.showLoadingState('parse-html', 'Parsing...');
        
        try {
            const extractedData = this.htmlParser.parseHTML(htmlInput);
            this.formDataManager.populateForm(extractedData);
            
            // Switch to form tab and generate HTML
            this.tabManager.showTabByName('form-to-html');
            this.generateHTML();
            
            this.uiManager.hideLoadingState('parse-html', 'Parse to Form');
            this.uiManager.showSuccessMessage('HTML parsed successfully! Form has been populated.');
            
        } catch (error) {
            this.uiManager.hideLoadingState('parse-html', 'Parse to Form');
            this.uiManager.showErrorMessage('Error parsing HTML: ' + error.message);
        }
    }

    loadSampleData() {
        // Sample data based on the original ICH example 
        const sampleData = {
            title: 'Enhancing Transfers to Community Hospitals via Fast Track & Communication Redesign',
            poc: 'li_huan_teo@ttsh.com.sg',
            partners: 'Acute hospitals',
            category: 'Admission',
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
        
        this.formDataManager.populateForm(sampleData);
        
        // Switch to form tab and generate HTML
        this.tabManager.showTabByName('form-to-html');
        this.generateHTML();
        
        // Show success message
        this.uiManager.showSuccessMessage('Sample data loaded successfully! Check out the form and preview.');
    }
}