/** Max decoded image size stored in MongoDB (Atlas) per image */
const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;

const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();

  if (trimmed.startsWith('blob:')) {
    const err = new Error(
      'Invalid image: temporary browser URLs cannot be saved. Upload the image file again.'
    );
    err.statusCode = 400;
    throw err;
  }

  if (trimmed.startsWith('data:image/')) {
    const comma = trimmed.indexOf(',');
    if (comma === -1) {
      const err = new Error('Invalid image data');
      err.statusCode = 400;
      throw err;
    }
    const base64 = trimmed.slice(comma + 1);
    const bytes = Buffer.from(base64, 'base64').length;
    if (bytes > MAX_IMAGE_BYTES) {
      const err = new Error('Image too large. Use a file under 2.5 MB.');
      err.statusCode = 400;
      throw err;
    }
    return trimmed;
  }

  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  const err = new Error('Image must be an https URL, site path (/...), or uploaded file');
  err.statusCode = 400;
  throw err;
};

const sanitizeProductImages = (images) => {
  if (!Array.isArray(images)) {
    return [];
  }
  return images.map(sanitizeImageUrl).filter(Boolean);
};

module.exports = { sanitizeProductImages, sanitizeImageUrl, MAX_IMAGE_BYTES };
