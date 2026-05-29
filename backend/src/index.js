require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const seedIfEmpty = require('./seed/seedIfEmpty');
const dbReady = require('./middleware/dbReady');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    database: dbStates[mongoose.connection.readyState] ?? 'unknown',
    dbName: mongoose.connection.name || null,
  });
});

app.use('/api/products', dbReady, productRoutes);
app.use('/api/orders', dbReady, orderRoutes);
app.use('/api/auth', dbReady, authRoutes);
app.use('/api/payments', dbReady, paymentRoutes);
app.use('/api/admin', dbReady, adminRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await seedIfEmpty();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
