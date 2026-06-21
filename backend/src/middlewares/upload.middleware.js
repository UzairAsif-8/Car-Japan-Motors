/**
 * Multer configuration for image uploads.
 *
 * Files are kept in memory (no disk writes) and streamed straight to Cloudinary
 * by the cloudinary service. Accepts images only, max 5MB each, up to 20 files.
 */
import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (file.mimetype.startsWith('image/')) return cb(null, true);
  cb(ApiError.badRequest('Only image files are allowed'));
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 20,
  },
});

// `images` is the multipart field name expected from the client.
export const uploadCarImages = upload.array('images', 20);

export default upload;
