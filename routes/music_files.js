const router = require('express').Router();
const db = require('../lib/services/database');
const MusicFileCtrl = require('../lib/controllers/MusicFileCtrl');

const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept audio files only
    if (!file.originalname.match(/\.(mp3|wav|ogg|flac)$/)) {
      return cb(new Error('Only audio files are allowed!'), false);
    }
    cb(null, true);
  }
});

router.post('/', upload.single('file'), async (req, res) => {
    const { title, artist, album, genre, duration } = req.body;
    // Validate payload
    if (!title || !artist || !album || !genre || !duration) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate file
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate duration (assuming it should be a positive number)
    if (isNaN(duration) || Number(duration) <= 0) {
        return res.status(400).json({ error: 'Invalid duration' });
    }

    // Validate string fields
    const stringFields = { title, artist, album, genre };
    for (const [field, value] of Object.entries(stringFields)) {
        if (typeof value !== 'string' || value.trim() === '') {
            return res.status(400).json({ error: `Invalid ${field}` });
        }
    }
    const filePath = req.file.path;

    try {
        const musicFileCtrl = new MusicFileCtrl(filePath, req.body);
        const fileUrl = await musicFileCtrl.upload();
        const musicFile = await musicFileCtrl.saveToDatabase(fileUrl);

        res.status(201).json(musicFile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload music file' });
    }
});

router.get('/list', async (req, res) => {
    const musicFileCtrl = new MusicFileCtrl();
    const musicFiles = await musicFileCtrl.list();
    res.status(200).json(musicFiles);
}); 

module.exports = router;