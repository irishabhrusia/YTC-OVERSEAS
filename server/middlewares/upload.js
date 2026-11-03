const multer = require('multer');
const path = require('path');
const { uploadService, generateSafeFilename } = require('../services/uploadService');

// Image upload configuration: Memory storage for streaming to Cloudinary (max 2MB, jpg, jpeg, png, webp, svg)
const imageStorage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPG, JPEG, PNG, WEBP, and SVG images are allowed.'
      ),
      false
    );
  }
};

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: imageFileFilter,
});

// CV upload configuration: Private local disk storage (max 5MB, pdf, doc, docx)
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadService.getCvDirectory());
  },
  filename: (req, file, cb) => {
    cb(null, generateSafeFilename(file.originalname));
  },
});

const cvFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  // Removed 'application/octet-stream' — it is a generic binary type that allows
  // arbitrary files (executables, archives) to bypass this check. Real PDF/DOC/DOCX
  // files always have their specific MIME types in modern browsers.
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'),
      false
    );
  }
};

const cvUpload = multer({
  storage: cvStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: cvFileFilter,
});

module.exports = {
  imageUpload,
  cvUpload,
};
