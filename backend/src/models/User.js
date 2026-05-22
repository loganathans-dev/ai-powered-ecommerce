const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    type: { type: String, default: 'Home' },
    street: String,
    city: String,
    state: String,
    zip: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, default: 'Active' },
    addresses: { type: [addressSchema], default: [] },
    orders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.virtual('joinDate').get(function joinDate() {
  return this.createdAt ? this.createdAt.toISOString().split('T')[0] : '';
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
