class HTMLParser {
    parseHTML(htmlString) {
        // Input validation
        if (!htmlString || typeof htmlString !== 'string') {
            throw new Error('Please provide valid HTML content to parse.');
        }
        
        if (htmlString.trim().length === 0) {
            throw new Error('HTML content cannot be empty.');
        }
        
        // Basic HTML structure check
        if (!htmlString.includes('<table') && !htmlString.includes('<tr') && !htmlString.includes('<td')) {
            throw new Error('HTML must contain table structure with <table>, <tr>, and <td> elements.');
        }
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        
        // Check for parsing errors
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid HTML format. Please check your HTML syntax and try again.');
        }
        
        try {
            const extractedData = this.extractDataFromHTML(doc);
            
            // Validate that some data was extracted
            const hasData = Object.values(extractedData).some(value => value && value.toString().trim() !== '');
            if (!hasData) {
                throw new Error('No recognizable project data found in the HTML. Please ensure the HTML follows the MOHT project report format.');
            }
            
            return extractedData;
        } catch (error) {
            if (error.message.includes('No recognizable project data')) {
                throw error;
            }
            throw new Error('Error processing HTML content: ' + error.message);
        }
    }

    extractDataFromHTML(doc) {
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
                    
                    // Map categories to form fields using configuration
                    const fieldKey = FIELD_MAPPINGS.htmlToField[category.toLowerCase()];
                    if (fieldKey) {
                        if (fieldKey === 'poc') {
                            const emailLink = details.querySelector('a[href^="mailto:"]');
                            data[fieldKey] = emailLink ? emailLink.textContent.trim() : details.textContent.trim();
                        } else if (['objectives', 'interventions', 'outcomes'].includes(fieldKey)) {
                            data[fieldKey] = this.extractListContent(details);
                        } else {
                            data[fieldKey] = details.textContent.trim();
                        }
                    }
                }
            });
        });
        
        return data;
    }

    extractListContent(element) {
        const list = element.querySelector('ul, ol');
        if (list) {
            const items = list.querySelectorAll('li');
            return Array.from(items).map(item => item.textContent.trim()).join('\n');
        }
        return element.textContent.trim();
    }
}