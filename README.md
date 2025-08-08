# MOHT Project Report Converter

A web application that converts between form inputs and HTML table format for Ministry of Health Technology (MOHT) project reports.

## Features

- **Form to HTML**: Fill out a user-friendly form and generate properly formatted HTML tables
- **HTML to Form**: Paste existing HTML and automatically populate form fields
- **Live Preview**: See real-time preview of generated HTML
- **Copy & Download**: Easy copy to clipboard or download HTML files
- **Responsive Design**: Works on desktop and mobile devices

## Usage

### Form to HTML

1. Fill out the project details form with your information
2. The HTML preview updates automatically as you type
3. Click "Copy HTML" to copy the generated code to clipboard
4. Or click "Download HTML" to save as a file

### HTML to Form

1. Switch to the "HTML to Form" tab
2. Paste your existing HTML table code
3. Click "Parse to Form" to populate the form fields
4. Switch back to "Form to HTML" tab to edit and regenerate

## Project Structure

```
├── index.html      # Main HTML file with form and interface
├── styles.css      # CSS styling for responsive design
├── script.js       # JavaScript functionality for conversion
└── README.md       # This documentation
```

## Deployment

This application is designed to be deployed on GitHub Pages:

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select "Deploy from a branch" and choose "main"
4. Your app will be available at `https://username.github.io/repository-name`

## HTML Format

The generated HTML follows the standard MOHT project report format with:

- **Project Details Table**: Title, POC, Partners, Intent, Status
- **Project Summary Table**: Dates, Sample Size, Reason, Objectives, Stakeholders, Interventions, Outcomes
- Proper styling with alternating row colors and responsive design
- Support for bullet points and numbered lists in objectives, interventions, and outcomes

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - Feel free to use and modify as needed.
