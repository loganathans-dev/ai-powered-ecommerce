const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'MongoServerSelectionError' || err.name === 'MongooseError') {
    status = 503;
    message = 'Database connection failed. Verify MONGODB_URI and Atlas network access.';
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;
