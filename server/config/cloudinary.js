require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const isConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(
    cloudName &&
      cloudName.trim().length > 0 &&
      apiKey &&
      apiKey.trim().length > 0 &&
      apiSecret &&
      apiSecret.trim().length > 0
  );
};

// Configure cloudinary dynamically or on startup
if (isConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });
} else {
  console.warn(
    '[Cloudinary] WARNING: Missing Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Public image uploads will be unavailable until credentials are provided in .env.'
  );
}

// Function to ensure configuration is active when called
const getCloudinary = () => {
  if (isConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
      api_key: process.env.CLOUDINARY_API_KEY.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
      secure: true,
    });
  }
  return cloudinary;
};

module.exports = {
  cloudinary,
  getCloudinary,
  isConfigured,
};
