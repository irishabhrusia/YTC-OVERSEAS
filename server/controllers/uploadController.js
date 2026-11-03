const { uploadService } = require('../services/uploadService');
const { isConfigured } = require('../config/cloudinary');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Upload an image to Cloudinary (ytc/images)
 * @route   POST /api/admin/upload/image
 * @access  Protected (super_admin, editor)
 */
const uploadImage = asyncHandler(async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message:
        'Cloudinary storage is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.',
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file uploaded',
    });
  }

  try {
    const result = await uploadService.uploadImageToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    res.status(200).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image to Cloudinary',
    });
  }
});

/**
 * @desc    Delete an image from Cloudinary by publicId
 * @route   DELETE /api/admin/upload/image
 * @access  Protected (super_admin, editor)
 */
const deleteImage = asyncHandler(async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message:
        'Cloudinary storage is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.',
    });
  }

  const { publicId } = req.body;

  if (!publicId || typeof publicId !== 'string' || publicId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'publicId is required in request body',
    });
  }

  try {
    const result = await uploadService.deleteImageFromCloudinary(publicId.trim());

    if (result && result.result === 'not found') {
      return res.status(404).json({
        success: false,
        message: 'Image with the specified publicId was not found in Cloudinary',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image from Cloudinary',
    });
  }
});

module.exports = {
  uploadImage,
  deleteImage,
};
