const sanitizeImageUrls = (images) => {
  if (!Array.isArray(images)) return images;
  return images.filter((url) => typeof url === 'string' && !url.startsWith('blob:'));
};

module.exports = { sanitizeImageUrls };
