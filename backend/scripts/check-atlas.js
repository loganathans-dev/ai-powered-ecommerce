require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const https = require('https');
const mongoose = require('mongoose');

const getPublicIp = () =>
  new Promise((resolve) => {
    https
      .get('https://api.ipify.org', (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve(data.trim() || 'unknown'));
      })
      .on('error', () => resolve('unknown'));
  });

const main = async () => {
  const ip = await getPublicIp();
  const uri = process.env.MONGODB_URI;

  console.log('\n--- MongoDB Atlas connection check ---\n');
  console.log('Your public IP (add this in Atlas → Network Access):', ip);
  console.log('Or use: 0.0.0.0/0 (allow from anywhere, dev only)\n');

  if (!uri) {
    console.error('MONGODB_URI is missing in backend/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || 'ecommerce',
      serverSelectionTimeoutMS: 15000,
    });
    console.log('SUCCESS: Connected to database:', mongoose.connection.name);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err.message);
    console.error('\nFix in Atlas: https://cloud.mongodb.com');
    console.error('  1. Network Access → Add IP Address →', ip);
    console.error('  2. Wait 1–2 minutes, then run: npm run db:check\n');
    process.exit(1);
  }
};

main();
