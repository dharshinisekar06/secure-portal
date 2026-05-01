const mongoose = require('mongoose');
module.exports = mongoose.model('AuditLog', new mongoose.Schema({
  action: String,
  userId: String,
  documentId: String,
  ip: String,
  details: String,
  createdAt: { type: Date, default: Date.now }
}));