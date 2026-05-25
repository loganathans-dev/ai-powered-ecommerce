const Order = require('../models/Order');
const User = require('../models/User');
const { formatOrder } = require('../utils/formatters');

const getPeriodDates = (period) => {
  const now = new Date();
  let start = null;
  let prevStart = null;

  const d = new Date(now);
  const pd = new Date(now);

  switch (period) {
    case '7days':
      start = new Date(d.setDate(d.getDate() - 7));
      prevStart = new Date(pd.setDate(pd.getDate() - 14));
      break;
    case '30days':
      start = new Date(d.setDate(d.getDate() - 30));
      prevStart = new Date(pd.setDate(pd.getDate() - 60));
      break;
    case '1year':
      start = new Date(d.setFullYear(d.getFullYear() - 1));
      prevStart = new Date(pd.setFullYear(pd.getFullYear() - 2));
      break;
  }
  return { start, prevStart, now };
};

const calcTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

const getDashboardStats = async (req, res) => {
  const period = req.query.period || '30days';
  const { start, prevStart } = getPeriodDates(period);

  const currentMatch = start ? { createdAt: { $gte: start } } : {};
  const currentPaidMatch = { paymentStatus: 'Paid', ...currentMatch };

  const prevMatch = start && prevStart ? { createdAt: { $gte: prevStart, $lt: start } } : null;
  const prevPaidMatch = prevMatch ? { paymentStatus: 'Paid', ...prevMatch } : null;

  const promises = [
    Order.aggregate([{ $match: currentPaidMatch }, { $group: { _id: null, revenue: { $sum: '$total' } } }]),
    Order.countDocuments(currentMatch),
    Order.distinct('customerEmail', { ...currentMatch, customerEmail: { $nin: ['', null] } }),
    Order.find(currentMatch).sort({ createdAt: -1 }).limit(5),
    Order.aggregate([
      { $match: currentPaidMatch },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', quantity: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { revenue: -1 } },
      { $limit: 3 },
    ]),
    User.countDocuments(),
  ];

  if (prevMatch) {
    promises.push(
      Order.aggregate([{ $match: prevPaidMatch }, { $group: { _id: null, revenue: { $sum: '$total' } } }]),
      Order.countDocuments(prevMatch),
      Order.distinct('customerEmail', { ...prevMatch, customerEmail: { $nin: ['', null] } })
    );
  }

  const results = await Promise.all(promises);
  const [revenueAgg, orderCount, customerEmails, recentOrdersRaw, topProducts, totalUsers] = results;

  const prevRevenueAgg = prevMatch ? results[6] : [{ revenue: 0 }];
  const prevOrderCount = prevMatch ? results[7] : 0;
  const prevCustomerEmails = prevMatch ? results[8] : [];

  const revenue = revenueAgg[0]?.revenue ?? 0;
  const customers = customerEmails.filter(Boolean).length;
  const prevRevenue = prevRevenueAgg[0]?.revenue ?? 0;
  const prevCustomers = prevCustomerEmails.filter(Boolean).length;

  const conversionRate = totalUsers > 0 ? Number(((customers / totalUsers) * 100).toFixed(1)) : 0;

  const revenueTrend = calcTrend(revenue, prevRevenue);
  const ordersTrend = calcTrend(orderCount, prevOrderCount);
  const customersTrend = calcTrend(customers, prevCustomers);

  res.json({
    revenue,
    orders: orderCount,
    totalUsers: totalUsers, // total registered users
    conversionRate,
    revenueTrend,
    ordersTrend,
    customersTrend,
    recentOrders: recentOrdersRaw.map(formatOrder),
    topProducts: topProducts.map((p) => ({
      name: p._id,
      quantity: p.quantity,
      revenue: p.revenue,
    })),
  });
};

module.exports = { getDashboardStats };
