const getPublicBaseUrl = (req) => {
  if (process.env.PUBLIC_API_URL) {
    return process.env.PUBLIC_API_URL.replace(/\/$/, '');
  }
  return `${req.protocol}://${req.get('host')}`;
};

const uploadImage = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  const url = `/uploads/products/${req.file.filename}`;
  const baseUrl = getPublicBaseUrl(req);

  res.status(201).json({
    url,
    fullUrl: `${baseUrl}${url}`,
  });
};

module.exports = { uploadImage };
