const crypto = require('crypto');
const fs = require('fs');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

exports.e_petitions_form = async (event, context) => {

    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: ''
        };
    }

    try {
        const formData = JSON.parse(event.body);

        const pdfBytes = fs.readFileSync('petycja_wzor.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const customFont = await setCustomFont(pdfDoc);
        const form = pdfDoc.getForm();
        // Update PDF form field appearances with the custom font
        updateFieldAppearances(form, customFont);

        form.getTextField('CityPetition').setText(formData.city + ", /elektroniczny znacznik czasu/");

        form.getTextField('Name').setText(formData.name);
        form.getTextField('StreetAndBuildingNumber').setText(formData.streetAndBuildingNumber);
        form.getTextField('ZipCode').setText(formData.zipcode);
        form.getTextField('City').setText(formData.city);
        form.getTextField('Email').setText(formData.email);

        form.getTextField('CityConsent').setText(formData.city + ", /elektroniczny znacznik czasu/");
        form.getTextField('NameConsent').setText(formData.name);

        const fields = form.getFields();
        fields.forEach(field => {
            field.enableReadOnly();
        });

        const pdfDocBytes = await pdfDoc.save();

        storePdfHash(pdfDocBytes);

        const pdfBuffer = Buffer.from(pdfDocBytes);
        const pdfBase64 = pdfBuffer.toString('base64');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/pdf',
            },
            body: pdfBase64,
            isBase64Encoded: true
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

function storePdfHash(fileBytes) {
    const hash = computeHash(fileBytes);

    console.log("hash: ", hash);

    // todo: implement hash storage
}

function computeHash(fileBytes) {
    const hash = crypto.createHash('sha256');
    hash.update(fileBytes);
    return hash.digest('hex');
}

async function setCustomFont(pdfDoc) {
    const fontBytes = await new Promise((resolve) =>
        fs.readFile('Arial.ttf', (err, data) => {
            if (err) resolve(null);
            else resolve(data);
        }),
    );
    let customFont = null;
    if (fontBytes) {
        pdfDoc.registerFontkit(fontkit);
        customFont = await pdfDoc.embedFont(fontBytes);
    }
    return customFont;
}

function updateFieldAppearances(form, customFont) {
    if (customFont) {
        const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
        form.updateFieldAppearances = function () {
            return rawUpdateFieldAppearances(customFont);
        };
    }
}
