const Order = require('../models/Order');
const { formatOrder } = require('../utils/formatters');
const createShopOrder = require('../utils/createShopOrder');

const getOrders = async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders.map(formatOrder));
};

const getUserOrders = async (req, res) => {
  const email = req.params.email?.toLowerCase();
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
  res.json(orders.map(formatOrder));
};

const createOrder = async (req, res) => {
  const order = await createShopOrder(req.body);
  res.status(201).json(order);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findOne({ orderId: req.params.id });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  res.json(formatOrder(order));
};

module.exports = {
  getOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
};
