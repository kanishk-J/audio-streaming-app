var express = require('express');
var router = express.Router();
const music_files = require('./music_files');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
