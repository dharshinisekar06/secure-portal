const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  otp: String,
  otpExpiry: Date,
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
}));