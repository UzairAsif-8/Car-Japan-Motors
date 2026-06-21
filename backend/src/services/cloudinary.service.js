/**
 * Cloudinary upload service.
 *
 * Receives in-memory file buffers (from multer) and streams them to Cloudinary,
 * returning only the secure URLs to be stored in `Car.images[]`. No image bytes
 * ever touch the database.
 */
import cloudinary, { CLOUDINARY_FOLDER } from '../config/cloudinary.js';

/** Upload a single buffer; resolves to the Cloudinary secure URL. */
export function uploadBuffer(buffer, filename = 'image') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: 'image',
        public_id: `${Date.now()}-${filename.replace(/\.[^.]+$/, '')}`,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

/** Upload many files (multer file objects) in parallel; resolves to URL[]. */
export async function uploadImages(files = []) {
  if (!files.length) return [];
  return Promise.all(files.map((file) => uploadBuffer(file.buffer, file.originalname)));
}

/** Best-effort deletion by secure URL (used when replacing/removing images). */
export async function destroyByUrl(url) {
  try {
    const publicId = extractPublicId(url);
    if (publicId) await cloudinary.uploader.destroy(publicId);
  } catch {
    // Non-fatal: a failed cleanup should never break the request.
  }
}

/** Derive the Cloudinary public_id (incl. folder) from a secure URL. */
function extractPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
  return match ? match[1] : null;
}
