const mongoose = require('mongoose');
module.exports = mongoose.model('Notification', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}));