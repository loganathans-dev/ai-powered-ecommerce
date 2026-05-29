const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { uploadProductImage } = require('../middleware/upload');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

router.post(
  '/image',
  uploadProductImage.single('image'),
  asyncHandler(uploadImage)
);

module.exports = router;
