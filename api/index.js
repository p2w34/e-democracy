const AWS = require('aws-sdk');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const stringSimilarity = require('string-similarity');
const verifyPDF = require('@ninja-labs/verify-pdf'); // installed with: npm i @ninja-labs/verify-pdf --legacy-peer-deps

const s3 = new AWS.S3();

exports.petitions = async (event) => {
    let pdfBuffer;
    let fileName;
    try {
        pdfBuffer = extractPdfBuffer(event);
        fileName = extractFileName(event);
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Error occurred, cannot parse file',
                errorMessage: error.message
            })
        };
    }
   
    try {
        validateFileProvided(pdfBuffer);
        await validateFileSimilarity('petycja_wzor.pdf', pdfBuffer);
        await validateFileSignature(pdfBuffer);
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Error occurred, cannot validate file',
                errorMessage: error.message
            })
        };
    }
    
    try {
        await s3Upload(pdfBuffer, fileName);
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error occurred, cannot store file',
                errorMessage: error.message
            })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'File uploaded successfully' })
    };
};

function extractPdfBuffer(event) {
    return Buffer.from(event.body, 'base64');
}

function extractFileName(event) {
    const contentDisposition = event.headers['content-disposition'];
    const originalFileNameMatch = contentDisposition ? /filename="(.+?)"/.exec(contentDisposition) : null;
    const originalFileName = originalFileNameMatch ? originalFileNameMatch[1] : `file-${Date.now()}.pdf`;
    return { originalFileName };
}

function validateFileProvided(pdfBuffer) {
    if (!pdfBuffer) {
        throw new Error('No file provided');
    }
}

async function validateFileSimilarity(templateFilePath, pdfBuffer) {
    try {
        const data = await pdfParse(pdfBuffer);

        const templateBuffer = fs.readFileSync(templateFilePath);
        const templateData = await pdfParse(templateBuffer);

        const similarity = calculatePdfSimilarity(data.text, templateData.text);

        console.log('similarity: ' + similarity);
        if (similarity < 80) {
            throw new Error('PDF similarity less than 80%');
        }
    } catch (error) {
        throw new Error('Error validating PDF similarity');
    }    
}

async function validateFileSignature(signedPdfBuffer) {
    
    try {
        const {
            verified,
            authenticity,
            integrity,
            expired,
            signatures
        } = verifyPDF(signedPdfBuffer);

    } catch (error) {
        throw new Error('Error validating PDF signature');
    }  
}

function calculatePdfSimilarity(text1, text2) {
    const similarity = stringSimilarity.compareTwoStrings(text1, text2);
    const similarityPercentage = (similarity * 100).toFixed(2); 
    return similarityPercentage;
}

async function s3Upload(pdfBuffer, { originalFileName }) {
    const key = `uploads/${originalFileName}`;

    const params = {
        Bucket: 'e-petitions',
        Key: key,
        Body: pdfBuffer,
        ContentType: 'application/pdf'
    };

    await s3.putObject(params).promise();
    console.log(`File uploaded successfully: ${key}`);
}
