const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getCloudinary, isConfigured } = require('../config/cloudinary');

const cvDir = path.join(__dirname, '..', 'uploads', 'cv');

// Ensure private CV upload directory exists
if (!fs.existsSync(cvDir)) {
  fs.mkdirSync(cvDir, { recursive: true });
}

/**
 * Generates a safe random filename preserving original extension
 */
const generateSafeFilename = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return `${Date.now()}-${randomBytes}${ext}`;
};

/**
 * Upload an image buffer to Cloudinary in the "ytc/images" folder
 *
 * @param {Buffer} buffer File buffer from multer memory storage
 * @param {string} originalName Original filename for public id naming
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadImageToCloudinary = (buffer, originalName = 'image') => {
  return new Promise((resolve, reject) => {
    if (!isConfigured()) {
      return reject(
        new Error(
          'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
        )
      );
    }

    const cld = getCloudinary();
    const uploadStream = cld.uploader.upload_stream(
      {
        folder: 'ytc/images',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Remove an image from Cloudinary by public ID
 *
 * @param {string} publicId Cloudinary public_id
 * @returns {Promise<any>}
 */
const deleteImageFromCloudinary = async (publicId) => {
  if (!isConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
    );
  }

  const cld = getCloudinary();
  const result = await cld.uploader.destroy(publicId);
  return result;
};

const uploadService = {
  getCvDirectory: () => cvDir,

  uploadImageToCloudinary,
  deleteImageFromCloudinary,

  deleteFile: (filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error('Error deleting file:', err.message);
    }
  },
};

module.exports = {
  uploadService,
  generateSafeFilename,
};
