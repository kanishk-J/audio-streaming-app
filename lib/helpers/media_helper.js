const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

class MediaHelper {
    constructor() {
        
    }

    async convertToHLS(filePath) {

        const mkdirAsync = promisify(fs.mkdir);
        // Create a temporary directory for HLS files
        const hlsDir = path.join('temp', 'hls', Date.now().toString());
        await mkdirAsync(hlsDir, { recursive: true });

        // Convert the uploaded file to HLS
        await new Promise((resolve, reject) => {
            ffmpeg(filePath)
                .outputOptions([
                    '-hls_time 10',
                    '-hls_list_size 0',
                    '-f hls'
                ])
                .output(path.join(hlsDir, 'playlist.m3u8'))
                .on('end', resolve)
                .on('error', reject)
                .run();
        });

        // Prepare the HLS files for upload
        const hlsFiles = await fs.promises.readdir(hlsDir);
        const uploadPromises = hlsFiles.map(async (file) => {
            const fileBuffer = await fs.promises.readFile(path.join(hlsDir, file));
            return {
                originalname: file,
                buffer: fileBuffer,
                mimetype: 'application/vnd.apple.mpegurl'
            };
        });

        // Replace the original file with the HLS files
        const convertedFiles = Promise.all(uploadPromises);

        // Clean up the temporary HLS directory
        await fs.promises.rm(hlsDir, { recursive: true, force: true });
        return convertedFiles;
    }
}

module.exports = MediaHelper;
