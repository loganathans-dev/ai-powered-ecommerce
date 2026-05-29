const Product = require('../models/Product');
const { formatProduct } = require('../utils/formatters');
const { getNextProductId } = require('../utils/productId');
const { sanitizeProductImages } = require('../utils/sanitizeProductImages');

const findProductByParamId = async (id) => {
  if (/^\d+$/.test(String(id))) {
    return Product.findOne({ productId: Number(id) });
  }
  return Product.findById(id);
};

const getProducts = async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.featured === 'true' || req.query.featured === true) {
    filter.featured = true;
  }

  const products = await Product.find(filter).sort({ productId: 1 });
  res.json(products.map(formatProduct));
};

const getProduct = async (req, res) => {
  const product = await findProductByParamId(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(formatProduct(product));
};

const createProduct = async (req, res) => {
  const productId = req.body.id || (await getNextProductId());
  const body = { ...req.body, productId: Number(productId) };
  if (body.images) {
    body.images = sanitizeProductImages(body.images);
  }
  const product = await Product.create(body);
  res.status(201).json(formatProduct(product));
};

const updateProduct = async (req, res) => {
  const product = await findProductByParamId(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { id, productId, _id, ...updates } = req.body;
  if (updates.images) {
    updates.images = sanitizeProductImages(updates.images);
  }
  Object.assign(product, updates);
  await product.save();

  res.json(formatProduct(product));
};

const deleteProduct = async (req, res) => {
  const product = await findProductByParamId(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ success: true });
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
