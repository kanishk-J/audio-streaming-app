const router = require('express').Router();
const s3Service = require('../lib/services/s3');

router.get('/music/:album/:title/:file_name', async (req, res) => {
    const file_name = `music/${req.params.album}/${req.params.title}/${req.params.file_name}`;

    try {
        const fileData = await s3Service.getFileStream(file_name);
        
        // Check if fileData is a readable stream
        if (fileData.pipe && typeof fileData.pipe === 'function') {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.set('Content-Type', 'audio/mpeg');
            fileData.pipe(res);
        } else {
            // If it's not a stream, assume it's the file content
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.set('Content-Type', 'audio/mpeg');
            res.send(fileData);
        }
    } catch (error) {
        console.error('Error downloading file from S3:', error);
        res.status(500).send('Error downloading file');
    }
});

module.exports = router;