const mongoose = require('mongoose');

const DB_NAME = process.env.MONGODB_DB_NAME || 'ecommerce';

const normalizeMongoUri = (uri) => {
  if (!uri) return uri;

  const withoutDb = uri.match(/^((?:mongodb(?:\+srv)?):\/\/[^/]+\.mongodb\.net)\/?(\?.*)?$/i);
  if (withoutDb) {
    const [, base, query = ''] = withoutDb;
    return `${base}/${DB_NAME}${query}`;
  }

  return uri;
};

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    throw new Error('MONGODB_URI is not defined in backend/.env');
  }

  if (!rawUri.includes('mongodb.net')) {
    throw new Error('Atlas only: MONGODB_URI must be a mongodb+srv://...mongodb.net/... URI');
  }

  const uri = normalizeMongoUri(rawUri);
  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(uri, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Atlas connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n--- Atlas connection failed ---');
      console.error('Add your IP in MongoDB Atlas:');
      console.error('  https://cloud.mongodb.com → Network Access → Add IP Address');
      console.error('  Use "Allow Access from Anywhere" (0.0.0.0/0) for development.');
      console.error('  Then wait 1–2 minutes and run: npm run db:check\n');
    }
    throw error;
  }
};

module.exports = connectDB;
