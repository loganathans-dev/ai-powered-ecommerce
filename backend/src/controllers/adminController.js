const Order = require('../models/Order');
const User = require('../models/User');
const { formatOrder } = require('../utils/formatters');

const getPeriodStart = (period) => {
  const now = new Date();
  switch (period) {
    case '7days':
      return new Date(now.setDate(now.getDate() - 7));
    case '30days':
      return new Date(now.setDate(now.getDate() - 30));
    case '1year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return null;
  }
};

const buildDateMatch = (period) => {
  const start = getPeriodStart(period);
  if (!start) return {};
  return { createdAt: { $gte: start } };
};

const getDashboardStats = async (req, res) => {
  const period = req.query.period || '30days';
  const dateMatch = buildDateMatch(period);
  const paidMatch = { paymentStatus: 'Paid', ...dateMatch };

  const [revenueAgg, orderCount, customerEmails, recentOrdersRaw, topProducts, totalUsers] =
    await Promise.all([
      Order.aggregate([
        { $match: paidMatch },
        { $group: { _id: null, revenue: { $sum: '$total' } } },
      ]),
      Order.countDocuments(dateMatch),
      Order.distinct('customerEmail', {
        ...dateMatch,
        customerEmail: { $nin: ['', null] },
      }),
      Order.find(dateMatch).sort({ createdAt: -1 }).limit(5),
      Order.aggregate([
        { $match: paidMatch },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.name',
            quantity: { $sum: '$items.quantity' },
            revenue: {
              $sum: { $multiply: ['$items.price', '$items.quantity'] },
            },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 3 },
      ]),
      User.countDocuments(),
    ]);

  const revenue = revenueAgg[0]?.revenue ?? 0;
  const customers = customerEmails.filter(Boolean).length;
  const conversionRate =
    totalUsers > 0 ? Number(((customers / totalUsers) * 100).toFixed(1)) : 0;

  res.json({
    revenue,
    orders: orderCount,
    customers,
    conversionRate,
    recentOrders: recentOrdersRaw.map(formatOrder),
    topProducts: topProducts.map((p) => ({
      name: p._id,
      quantity: p.quantity,
      revenue: p.revenue,
    })),
  });
};

module.exports = { getDashboardStats };
