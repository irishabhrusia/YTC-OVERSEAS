const express = require('express');
const router = express.Router();

const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middlewares/auth');
const { imageUpload } = require('../middlewares/upload');

// Admin-only route for uploading public images to Cloudinary
router.post(
  '/image',
  protect,
  authorize('super_admin', 'editor'),
  imageUpload.single('image'),
  uploadImage
);

// Admin-only route for removing an image from Cloudinary
router.delete(
  '/image',
  protect,
  authorize('super_admin', 'editor'),
  deleteImage
);

module.exports = router;
