const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
const Order = require('./backend/src/models/Order');

mongoose.connect('mongodb+srv://loganathanofficial25_db_user:Pass1234@cluster0.gcroq8r.mongodb.net/ecommerce?appName=Cluster0')
  .then(async () => {
    const userCount = await User.countDocuments();
    const orderCount = await Order.countDocuments();
    const customerEmails = await Order.distinct('customerEmail');
    console.log("DB Total Users:", userCount);
    console.log("DB Total Orders:", orderCount);
    console.log("DB Unique Customer Emails in Orders:", customerEmails.length);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
