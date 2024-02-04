const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.e_petitions = async (event) => {

    console.log("event: ", event);

    let pdfBuffer;
    try {
        pdfBuffer = extractPdfBuffer(event);
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

    validateHash();
    validateSignature();
    
    try {
        await s3Upload(pdfBuffer, "filename");
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
    console.log("event: ", event.body);
    return Buffer.from(event.body, 'base64');
}

function validateHash() {
    // todo: implement
}

function validateSignature() {
    // todo: implement
}

async function s3Upload(pdfBuffer, originalFileName) {
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
