const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, enum: ['mens', 'womens', 'kids'], required: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    images: { type: [String], default: [] },
    sizes: { type: [Number], default: [] },
    colors: { type: [String], default: [] },
    description: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    offer: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
