const cron = require('node-cron');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendExpiryNotification } = require('../utils/mailer');
const { log } = require('../utils/logger');
const fs = require('fs');

// Notify before expiry — every 10 seconds
cron.schedule('*/10 * * * * *', async () => {
  const docs = await Document.find({
    isDeleted: false,
    notifyBefore: { $ne: null },
    notificationSent: false
  });

  for (const doc of docs) {
    const notifyAt = new Date(doc.expiresAt - doc.notifyBefore * 1000);
    if (new Date() >= notifyAt) {
      const user = await User.findById(doc.userId);
      if (user) {
        await sendExpiryNotification(user.email, doc.originalName, doc.expiresAt, doc.notifyBefore);
        await Notification.create({
          userId: doc.userId,
          documentId: doc._id,
          message: `Document "${doc.originalName}" expires soon!`
        });
        doc.notificationSent = true;
        await doc.save();
        console.log('Notification sent for:', doc.originalName);
      }
    }
  }
});

// Auto delete AFTER expiry — every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
  const expired = await Document.find({ expiresAt: { $lt: new Date() }, isDeleted: false });
  for (const doc of expired) {
    if (doc.filePath && fs.existsSync(doc.filePath)) fs.unlinkSync(doc.filePath);
    if (doc.consentVideoPath && fs.existsSync(doc.consentVideoPath)) fs.unlinkSync(doc.consentVideoPath);
    doc.isDeleted = true;
    await doc.save();
    log('AUTO_DELETED', null, doc._id, 'system', 'Expired document auto-deleted');
    console.log('Auto-deleted:', doc.originalName);
  }
});