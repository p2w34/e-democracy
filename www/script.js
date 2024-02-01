// just to debug
async function listFormFields() {
    const url = 'petycja_wzor.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

    const form = pdfDoc.getForm();
    const fieldNames = form.getFields().map(f => f.getName());

    console.log("Field names in the PDF:", fieldNames);
}

async function fillPDFAndDownload() {
    // Fetch the existing PDF
    const url = 'petycja_wzor.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

    // Get the form
    const form = pdfDoc.getForm();

    // Fill the form fields
    const nameField = form.getTextField('Name');
    const addressField = form.getTextField('Address');
    const zipCodeField = form.getTextField('ZipCode');
    const cityField = form.getTextField('City');
    const emailField = form.getTextField('Email');
    const consentField = form.getTextField('Consent');
    const placeAndDateField = form.getTextField('PlaceAndDate');
    
    const name2Field = form.getTextField('Name2');
    const placeAndDate2Field = form.getTextField('PlaceAndDate2');

    nameField.setText(document.getElementById('name').value);
    addressField.setText(document.getElementById('address').value);
    zipCodeField.setText(document.getElementById('zipcode').value);
    cityField.setText(document.getElementById('city').value);
    emailField.setText(document.getElementById('email').value);
    placeAndDateField.setText(document.getElementById('city').value + ", " + getPresentDate());

    if (document.getElementById('consent').checked) {
        consentField.setText('TAK');
    } else {
        consentField.setText('NIE');
    }

    name2Field.setText(document.getElementById('name').value);
    placeAndDate2Field.setText(document.getElementById('city').value + ", " + getPresentDate());


    // Flatten the form to prevent further editing
    form.flatten();

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();

    // Trigger the download
    download(pdfBytes, generateFilename(), "application/pdf");
}

// Utility function for downloading the PDF
function download(data, filename, type) {
    const blob = new Blob([data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Utility function to get present date in format dd.mm.yyyy
function getPresentDate() {
    const date = new Date();
    return date.toLocaleDateString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).replace(/\//g, '.');
}

document.getElementById('submissionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('signedPetition');
    if (fileInput.files.length === 0) {
        alert('Please select a file to upload.');
        return;
    }

    const file = fileInput.files[0];
    if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
    }

    const url = 'https://83msjx8vtf.execute-api.eu-west-1.amazonaws.com/prod/e-petitions';

    const formData = new FormData();
    formData.append('file', file);

    const headers = new Headers();
    headers.append('content-disposition', `attachment; filename="${file.name}"`); // Set the original file name

    fetch(url, {
        method: 'POST',
        body: formData, // formData will set the correct Content-Type header
        headers: headers,
    })
    .then(response => {
        if (response.ok) {
            alert("Dziękujemy!\n\nZłożymy w Twoim imieniu petycję i oczywiście pozostajemy w kontakcie.\nBędzie nam bardzo miło, jeżeli powiesz o nas swoim znajomym - to bardzo pomaga!");
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error uploading file.');
    });
});


// Event listener for the button
document.getElementById('fillPdf').addEventListener('click', fillPDFAndDownload);

const generateRandomString = () => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const generateFilename = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(now.getDate()).padStart(2, '0');
    const randomString = generateRandomString();

    return `petycja_${year}${month}${day}_${randomString}.pdf`;
};
