const db = require('../services/database');
const s3Service = require('../services/s3');
const MediaHelper = require('../helpers/media_helper');

class MusicFileCtrl {
    constructor(file_path, meta_data) {
        this.file_path = file_path;
        this.meta_data = meta_data;
    }

    async upload() {
        const mediaHelper = new MediaHelper();
        const files = await mediaHelper.convertToHLS(this.file_path);
        const fileUrl = await this.uploadHLSFiles(files);
        return fileUrl;
    }

    async uploadHLSFiles(files) {
        let fileUrl = '';
        for (const file of files) {
            const ext = file.originalname.split('.').pop();
            const file_suffix = file.originalname.split('.').shift().split('playlist')[1] || '';
            const file_name = this.#getFileName(this.meta_data.title, file_suffix, ext);
            const url = await s3Service.uploadFile(file, this.meta_data, file_name);
            if (ext === 'm3u8') {
                fileUrl = url;
            }
        }
        return fileUrl;
    }

    #getFileName(file_name, file_suffix, ext) {
        if (file_suffix) {
            return `${file_name}-${file_suffix}.${ext}`;
        }
        return `${file_name}.${ext}`;
    }

    async saveToDatabase(fileUrl) {
        const [musicFile] = await db('music_files')
            .insert({
                title: this.meta_data.title,
                artist: this.meta_data.artist,
                album: this.meta_data.album,
                genre: this.meta_data.genre,
                duration: this.meta_data.duration,
                path: fileUrl
            })
            .returning('*');
        return musicFile;
    }

    async list() {
        const musicFiles = await db('music_files')
            .select('*');
        
        return musicFiles.map((file) => {
            return {
                ...file,
                path: `http://localhost:3000/assets/music/${file.album}/${file.title}/playlist.m3u8`,
            };
        });
    }
}

module.exports = MusicFileCtrl;