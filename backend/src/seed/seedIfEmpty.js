const bcrypt = require('bcryptjs');
const Counter = require('../models/Counter');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { products, users, orders } = require('./seedData');

const seedIfEmpty = async () => {
  const productCount = await Product.countDocuments();
  if (productCount > 0) {
    return false;
  }

  console.log('Seeding ecommerce database...');

  await Product.insertMany(products);
  await Counter.findByIdAndUpdate('productId', { seq: 8 }, { upsert: true });

  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 10);
    await User.create({ ...user, password: hashed });
  }

  await Order.insertMany(orders);

  console.log('Seed complete: products, users, and orders added.');
  return true;
};

module.exports = seedIfEmpty;
