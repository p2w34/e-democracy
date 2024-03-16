const AWS = require('aws-sdk');
const crypto = require('crypto');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const s3 = new AWS.S3();

exports.e_petitions = async (event) => {

    console.log("event: ", event);

    let xmlBuffer;
    try {
        xmlBuffer = extractXmlBuffer(event);
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

    const xmlBytes = xmlBuffer.toString('utf-8');

    validatePetitionHash(xmlBytes);
    validatePetitionSignature();

    const filename = getPesel(xmlBytes) + '.pdf.xml';
    
    try {
        await s3Upload(xmlBuffer, filename);
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

function extractXmlBuffer(event) {
    const data = JSON.parse(event.body).fileData;
    console.log("data: ", data);
    return Buffer.from(data, 'base64');
}

function validatePetitionHash(xmlBytes) {
    const buffer = extractPetitionBuffer(xmlBytes);
    const hash = computeHash(buffer);

    console.log("hash: ", hash);

    // todo: implement validation against hash from storage
}

function validatePetitionSignature() {
    // todo: implement
}

async function s3Upload(xmlBuffer, fileName) {
    const key = `uploads/${fileName}`;

    const params = {
        Bucket: 'e-petitions',
        Key: key,
        Body: xmlBuffer,
        ContentType: 'text/xml'
    };

    await s3.putObject(params).promise();
    console.log(`File uploaded successfully: ${key}`);
}

function extractPetitionBuffer(xmlBytes) {
    const doc = new dom().parseFromString(xmlBytes);
    const petitionBytesBase64 = xpath.select("//*[local-name()='DaneZalacznika']", doc)[0].textContent.trim();
    const petitionBuffer = Buffer.from(petitionBytesBase64, 'base64');

    return petitionBuffer;
}

function computeHash(buffer) {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
}

function getPesel(xmlBytes) {
    return '123';
}
