const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

class S3Service {
    constructor() {
        this.bucketName = process.env.S3_BUCKET_NAME;
    }

    async uploadFile(file, meta_data, file_name) {
        const params = {
            Bucket: this.bucketName,
            Key: `music/${meta_data.album}/${meta_data.title}/${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };

        try {
            const result = await s3.upload(params).promise();
            return result.Location; // Returns the URL of the uploaded file
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            throw error;
        }
    }

    async getFileStream(file_name) {
        const params = {
            Bucket: this.bucketName,
            Key: file_name
        };

        try {
            const data = await s3.getObject(params).promise();  
            return data.Body;
        } catch (error) {
            console.error('Error downloading file from S3:', error);
            throw error;
        }
    }
}

module.exports = new S3Service();
