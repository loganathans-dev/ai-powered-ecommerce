const Order = require('../models/Order');
const User = require('../models/User');
const { formatOrder } = require('./formatters');

const generateOrderId = () => `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

const createShopOrder = async ({
  customer,
  customerEmail,
  address,
  total,
  items = [],
  paymentStatus = 'Paid',
  status = 'Pending',
  razorpayOrderId = '',
  razorpayPaymentId = '',
}) => {
  let orderId = generateOrderId();
  while (await Order.exists({ orderId })) {
    orderId = generateOrderId();
  }

  const order = await Order.create({
    orderId,
    date: new Date().toISOString().split('T')[0],
    status,
    total,
    customer,
    customerEmail: customerEmail?.toLowerCase() || '',
    address: address || '',
    paymentStatus,
    items,
    razorpayOrderId,
    razorpayPaymentId,
  });

  if (customerEmail) {
    await User.findOneAndUpdate(
      { email: customerEmail.toLowerCase() },
      { $inc: { orders: 1, totalSpent: total } }
    );
  }

  return formatOrder(order);
};

module.exports = createShopOrder;
