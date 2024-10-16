const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs'); // Import fs module

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html directly from the project folder
});

// Handle form submission
app.post('/submit-form', (req, res) => {
    const formData = {
        Name: req.body.name,
        EmailID: req.body.email,
        MisNo: req.body.mis,
        Address: req.body.address,
        DOB: req.body.dob,
        Department: req.body.department,
        PhoneNo: req.body.phone,
        CGPA: parseFloat(req.body.cgpa),  // Convert CGPA to a float
        BloodGroup: req.body.bloodGroup,
        PersonalEmailID: req.body.personalEmail,
        BatchNo: req.body.batchNo // Capture Batch No field
    };

    // Log the entire formData object
    console.log('Received form data:', formData);

    addToExcelFile(formData);
    res.send('Form data has been saved successfully!');
});

// Function to add form data to the Excel file
function addToExcelFile(data) {
    const filePath = path.join(__dirname, 'data.xlsx');

    // Check if the Excel file exists
    let workbook;
    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
    } else {
        // Create a new workbook if it doesn't exist
        workbook = xlsx.utils.book_new();
    }

    // Create a new worksheet without headers
    let worksheet;
    if (!workbook.Sheets['Sheet1']) {
        worksheet = xlsx.utils.json_to_sheet([data]);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    } else {
        // If the sheet exists, read the existing data
        worksheet = workbook.Sheets['Sheet1'];
        const existingData = xlsx.utils.sheet_to_json(worksheet);
        existingData.push(data); // Push the new data as a new row
        const newWorksheet = xlsx.utils.json_to_sheet(existingData);
        workbook.Sheets['Sheet1'] = newWorksheet; // Update the worksheet with the new data
    }

    // Save the workbook
    xlsx.writeFile(workbook, filePath);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
