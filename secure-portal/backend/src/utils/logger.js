const AuditLog = require('../models/AuditLog');
exports.log = (action, userId, documentId, ip, details) => {
  AuditLog.create({ action, userId, documentId, ip, details }).catch(console.error);
};