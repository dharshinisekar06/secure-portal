const mongoose = require('mongoose');
module.exports = mongoose.model('Document', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  originalName: String,
  filePath: String,
  consentVideoPath: String,
  secureToken: String,
  expiresAt: Date,
  isDeleted: { type: Boolean, default: false },
  notifyBefore: { type: Number, default: null },
  notificationSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}));