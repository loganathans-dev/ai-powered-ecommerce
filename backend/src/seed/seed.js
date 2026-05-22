require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const seedIfEmpty = require('./seedIfEmpty');

const seed = async () => {
  await connectDB();
  const seeded = await seedIfEmpty();

  if (!seeded) {
    console.log('Database already has products. Skipping seed.');
  }

  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
