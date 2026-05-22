const Counter = require('../models/Counter');

const getNextProductId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    'productId',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

module.exports = { getNextProductId };
