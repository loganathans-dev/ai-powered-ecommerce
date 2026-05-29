const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

router.post('/image', asyncHandler(uploadImage));

module.exports = router;
