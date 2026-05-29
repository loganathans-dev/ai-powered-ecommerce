const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/products');

const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

const getPublicBaseUrl = (req) => {
  if (process.env.PUBLIC_API_URL) {
    return process.env.PUBLIC_API_URL.replace(/\/$/, '');
  }
  return `${req.protocol}://${req.get('host')}`;
};

const extFromMime = (mime) => {
  const map = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return map[mime] || '.jpg';
};

const uploadImage = async (req, res) => {
  const { data, mimeType, filename } = req.body;

  if (!data) {
    res.status(400);
    throw new Error('No image data provided');
  }

  const base64 = data.includes(',') ? data.split(',')[1] : data;
  const buffer = Buffer.from(base64, 'base64');

  if (buffer.length === 0) {
    res.status(400);
    throw new Error('Invalid image data');
  }

  if (buffer.length > 5 * 1024 * 1024) {
    res.status(400);
    throw new Error('Image must be smaller than 5MB');
  }

  ensureUploadDir();

  const ext = path.extname(filename || '').toLowerCase();
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)
    ? ext
    : extFromMime(mimeType);
  const storedName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
  const filePath = path.join(UPLOAD_DIR, storedName);

  fs.writeFileSync(filePath, buffer);

  const url = `/uploads/products/${storedName}`;
  const baseUrl = getPublicBaseUrl(req);

  res.status(201).json({
    url,
    fullUrl: `${baseUrl}${url}`,
  });
};

module.exports = { uploadImage };
