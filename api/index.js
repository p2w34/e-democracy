const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        // The event body is expected to be a base64-encoded string of the PDF file
        const pdfBuffer = Buffer.from(event.body, 'base64');
        const bucketName = 'e-petitions'; // Replace with your bucket name
        const key = `uploads/${Date.now()}.pdf`; // Naming the file with a timestamp

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
