// just to debug
async function listFormFields() {
    const url = 'petycja_wzor.pdf';
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

    const form = pdfDoc.getForm();
    const fieldNames = form.getFields().map(f => f.getName());

    console.log("Field names in the PDF:", fieldNames);
}

function fetchCounterValue() {
    fetch('https://83msjx8vtf.execute-api.eu-west-1.amazonaws.com/prod/e-petitions-counter')
        .then(response => response.json())
        .then(data => {
            document.getElementById('counterValue').textContent = data.counter;
        })
        .catch(error => {
            console.error('Error fetching the counter value:', error);
            document.getElementById('counterValue').textContent = 'Counter unavailable';
        });
}

window.onload = fetchCounterValue;

async function sendFormDataAndDownloadPDF() {
    const formData = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        zipcode: document.getElementById('zipcode').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
        consent: document.getElementById('consent').checked
        // Add any other form fields you want to send to Lambda
    };

    try {
        const response = await fetch('https://83msjx8vtf.execute-api.eu-west-1.amazonaws.com/prod/e-petitions-form', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const filename = 'petycja.pdf';
        const pdfBlob = await response.blob();
        download(pdfBlob, filename, 'application/pdf');
    } catch (error) {
        console.error('Error:', error);
        alert('Error generating PDF');
    }
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
    const fileNameParts = file.name.split('.');
    const fileExtension = fileNameParts[fileNameParts.length - 1];

    if (fileExtension.toLowerCase() !== 'xml') {
        alert('Please select an XML file.');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');

    // Disable the button and show the spinner
    submitBtn.disabled = true;
    spinner.style.display = 'inline-block';

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result.split(',')[1]; // Extract base64 part
        sendFileToServer(base64String);
    };
    reader.readAsDataURL(file);

    function sendFileToServer(base64String) {
        const url = 'https://83msjx8vtf.execute-api.eu-west-1.amazonaws.com/prod/e-petitions';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileData: base64String })
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
        })
        .finally(() => {
            // Re-enable the button and hide the spinner after the process is complete
            submitBtn.disabled = false;
            spinner.style.display = 'none';
        });
    }
});


// Event listener for the button
document.getElementById('fillPdf').addEventListener('click', sendFormDataAndDownloadPDF);

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
