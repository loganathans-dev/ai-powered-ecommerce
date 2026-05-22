const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { formatUser } = require('../utils/formatters');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  res.json({
    user: formatUser(user),
    token: 'session-token',
  });
};

const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashed,
    phone: phone || '',
    addresses: [],
  });

  res.status(201).json({
    user: formatUser(user),
    token: 'session-token',
  });
};

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username !== adminUser || password !== adminPass) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  res.json({
    user: { name: 'Admin', role: 'admin' },
    token: 'admin-token',
  });
};

const getMe = async (req, res) => {
  const email = req.query.email?.toLowerCase();

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(formatUser(user));
};

const deleteAccount = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required to delete your account');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Incorrect password');
  }

  await user.deleteOne();
  res.json({ success: true, message: 'Account deleted successfully' });
};

const updateProfile = async (req, res) => {
  const { email, name, phone, addresses } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (addresses !== undefined) user.addresses = addresses;

  await user.save();
  res.json(formatUser(user));
};

module.exports = {
  login,
  signup,
  adminLogin,
  getMe,
  updateProfile,
  deleteAccount,
};
