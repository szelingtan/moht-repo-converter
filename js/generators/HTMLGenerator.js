class HTMLGenerator {
    createHTMLTables(data) {
        const mode = window.app?.modeManager?.getCurrentMode() || CONFIG.MODES.PROJECTS;
        
        if (mode === CONFIG.MODES.WORKFLOWS) {
            return this.createWorkflowHTML(data);
        } else {
            return this.createProjectHTML(data);
        }
    }

    createProjectHTML(data) {
        // Current full implementation - both project details + project summary
        const projectDetailsTable = this.createProjectDetailsTable(data);
        const projectSummaryTable = this.createProjectSummaryTable(data);
        return projectDetailsTable + projectSummaryTable;
    }

    createWorkflowHTML(data) {
        // Generate only workflow details (basic project details without dates/sample size)
        return `<h3>Workflow Details:</h3>
<table style="${TABLE_STYLES.base}">
  <tr style="${TABLE_STYLES.headerDetails}">
    <th style="${TABLE_STYLES.headerCell}">Item</th>
    <th style="${TABLE_STYLES.headerCellWide}">Details</th>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Title</b></td>
    <td style="${TABLE_STYLES.cell}">${data.title}</td>
  </tr>
  <tr>
    <td style="${TABLE_STYLES.cell}"><b>POC</b></td>
    <td style="${TABLE_STYLES.cell}">${data.poc ? `<a href="mailto:${data.poc}">${data.poc}</a>` : ''}</td>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Partners</b></td>
    <td style="${TABLE_STYLES.cell}">${data.partners}</td>
  </tr>
  <tr>
    <td style="${TABLE_STYLES.cell}"><b>Category</b></td>
    <td style="${TABLE_STYLES.cell}">${data.category}</td>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Status</b></td>
    <td style="${TABLE_STYLES.cell}">${data.status}</td>
  </tr>
</table>`;
    }

    createProjectDetailsTable(data) {
        return `<h3>Project Details:</h3>
<table style="${TABLE_STYLES.base}">
  <tr style="${TABLE_STYLES.headerDetails}">
    <th style="${TABLE_STYLES.headerCell}">Item</th>
    <th style="${TABLE_STYLES.headerCellWide}">Details</th>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Title</b></td>
    <td style="${TABLE_STYLES.cell}">${data.title}</td>
  </tr>
  <tr>
    <td style="${TABLE_STYLES.cell}"><b>POC</b></td>
    <td style="${TABLE_STYLES.cell}">${data.poc ? `<a href="mailto:${data.poc}">${data.poc}</a>` : ''}</td>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Partners</b></td>
    <td style="${TABLE_STYLES.cell}">${data.partners}</td>
  </tr>
  <tr>
    <td style="${TABLE_STYLES.cell}"><b>Category</b></td>
    <td style="${TABLE_STYLES.cell}">${data.category}</td>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Status</b></td>
    <td style="${TABLE_STYLES.cell}">${data.status}</td>
  </tr>
</table>`;
    }

    createProjectSummaryTable(data) {
        return `<h3>Project Summary:</h3>
<table style="${TABLE_STYLES.base}">
  <tr style="${TABLE_STYLES.headerSummary}">
    <th style="${TABLE_STYLES.headerCell}">Item</th>
    <th style="${TABLE_STYLES.headerCellWide}">Details</th>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Project Dates</b></td>
    <td style="${TABLE_STYLES.cell}">${data.projectDates}</td>
  </tr>
  <tr>
    <td style="${TABLE_STYLES.cell}"><b>Sample Size</b></td>
    <td style="${TABLE_STYLES.cell}">${data.sampleSize}</td>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Reason for Action</b></td>
    <td style="${TABLE_STYLES.cell}">${data.reason}</td>
  </tr>
  <tr>
    <td style="${TABLE_STYLES.cell}"><b>Aim / Objective</b></td>
    <td style="${TABLE_STYLES.cell}">
      ${this.formatAsList(data.objectives, 'ul')}
    </td>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Stakeholders</b></td>
    <td style="${TABLE_STYLES.cell}">${data.stakeholders}</td>
  </tr>
  <tr>
    <td style="${TABLE_STYLES.cell}"><b>Interventions</b></td>
    <td style="${TABLE_STYLES.cell}">
      ${this.formatAsList(data.interventions, 'ol')}
    </td>
  </tr>
  <tr style="${TABLE_STYLES.evenRow}">
    <td style="${TABLE_STYLES.cell}"><b>Outcomes</b></td>
    <td style="${TABLE_STYLES.cell}">
      ${this.formatAsList(data.outcomes, 'ol')}
    </td>
  </tr>
</table>`;
    }

    formatAsList(text, listType) {
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
        
        return `<${listType} style="${TABLE_STYLES.list}">${listItems}</${listType}>`;
    }
}