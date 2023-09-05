const express = require('express');

const { protect } = require('../controller/authController');
const { upload, uploadFile } = require('../controller/uploadController');

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
