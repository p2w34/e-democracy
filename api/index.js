const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        // Extract the original file name from the Content-Disposition header, if available
        const contentDisposition = event.headers['content-disposition'];
        const originalFileNameMatch = contentDisposition ? /filename="(.+?)"/.exec(contentDisposition) : null;

        // If the original file name is found in the header, use it; otherwise, use a default value
        const originalFileName = originalFileNameMatch ? originalFileNameMatch[1] : `file-${Date.now()}.pdf`;

        // The event body is expected to be a base64-encoded string of the PDF file
        const pdfBuffer = Buffer.from(event.body, 'base64');
        const bucketName = 'e-petitions'; // Replace with your bucket name

        // Use the original file name as the key for the S3 object
        const key = `uploads/${originalFileName}`;

        // Parameters for S3 upload
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: pdfBuffer,
            ContentType: 'application/pdf'
        };

        // Uploading the PDF to S3
        await s3.putObject(params).promise();

        // Logging the event
        console.log(`File uploaded successfully: ${key}`);

        // Return a 200 response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' })
        };
    } catch (error) {
        console.error('Error uploading file:', error);

        // Return a 500 response on error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error uploading file' })
        };
    }
};
