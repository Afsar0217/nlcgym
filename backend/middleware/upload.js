const multer = require('multer');
const cloudinary = require('../config/cloudinary');

/**
 * Multer configured with memory storage (buffer).
 * Files are held in memory briefly, then uploaded to Cloudinary.
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: JPG, PNG, WebP, GIF, PDF'), false);
    }
  },
});

/**
 * Upload a buffer to Cloudinary and return the secure URL.
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} folder - Cloudinary folder (e.g. 'coaches', 'blogs', 'resumes')
 * @returns {Promise<string>} Cloudinary secure URL
 */
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `nlc-gym/${folder}`,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Create upload middleware for a specific folder.
 * Returns { multerUpload, uploadToCloudinary }
 */
const createUploader = (folder) => {
  return {
    single: (fieldName) => upload.single(fieldName),
    uploadBuffer: (buffer) => uploadToCloudinary(buffer, folder),
  };
};

module.exports = { upload, uploadToCloudinary, createUploader };
