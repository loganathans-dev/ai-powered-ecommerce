const crypto = require('crypto');
const getRazorpay = require('../config/razorpay');
const createShopOrder = require('../utils/createShopOrder');

const ensureRazorpay = () => {
  const instance = getRazorpay();
  if (!instance) {
    const err = new Error(
      'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env'
    );
    err.statusCode = 503;
    throw err;
  }
  return instance;
};

const getKey = (_req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    res.status(503);
    throw new Error('Razorpay key is not configured');
  }
  res.json({ keyId });
};

const createPaymentOrder = async (req, res) => {
  const razorpay = ensureRazorpay();
  const amountInRupees = Number(req.body.amount);

  if (!amountInRupees || amountInRupees < 1) {
    res.status(400);
    throw new Error('Valid amount is required');
  }

  const amountPaise = Math.round(amountInRupees * 100);

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
  });

  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
};

const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    customer,
    customerEmail,
    address,
    total,
    items = [],
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification data is missing');
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    res.status(503);
    throw new Error('Razorpay secret is not configured');
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  const shopOrder = await createShopOrder({
    customer,
    customerEmail,
    address,
    total,
    items,
    paymentStatus: 'Paid',
    status: 'Pending',
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
  });

  res.status(201).json(shopOrder);
};

module.exports = { getKey, createPaymentOrder, verifyPayment };
