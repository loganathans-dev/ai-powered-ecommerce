const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
const Order = require('./backend/src/models/Order');

mongoose.connect('mongodb://127.0.0.1:27017/shoeshop')
  .then(async () => {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    console.log("Total Users:", userCount);
    console.log("Total Orders:", orderCount);
    const recentOrders = await Order.find().sort({ createdAt: -1 });
    console.log("All Orders total:", recentOrders.length);
    console.log("Orders dates:", recentOrders.map(o => o.createdAt));
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
