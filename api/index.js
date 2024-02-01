const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.petitions = async (event) => {
    try {
        const pdfBuffer = extractPdfBuffer(event);
        const fileName = extractFileName(event);
        await s3Upload(pdfBuffer, fileName);

        console.log(`File uploaded successfully`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' })
        };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error occurred' })
        };
    }
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
