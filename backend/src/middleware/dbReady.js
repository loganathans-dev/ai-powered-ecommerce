const mongoose = require('mongoose');

const dbReady = (_req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected. Check MongoDB URI and network access.',
    });
  }
  next();
};

module.exports = dbReady;
