const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
    total: { type: Number, required: true, min: 0 },
    customer: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    address: { type: String, default: '' },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Paid' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    items: { type: [orderItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
