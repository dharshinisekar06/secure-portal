const router = require('express').Router();
const Document = require('../models/Document');
const auth = require('../middleware/auth');
const { log } = require('../utils/logger');
const path = require('path');
const fs = require('fs');

// =======================
// 📄 Get my documents (FIXED)
// =======================
router.get('/', auth, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.userId, isDeleted: false });
    res.json(docs);
  } catch (err) {
    console.error('Documents error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 🔗 Access via secure token (public)
// =======================
router.get('/access/:token', async (req, res) => {
  try {
    const doc = await Document.findOne({
      secureToken: req.params.token,
      isDeleted: false
    });

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (doc.expiresAt < new Date()) {
      log('ACCESS_DENIED_EXPIRED', null, doc._id, req.ip, 'Link expired');
      return res.status(403).json({ error: 'Link has expired' });
    }

    log('ACCESS_SUCCESS', null, doc._id, req.ip, 'Document accessed via secure link');

    res.json({
      originalName: doc.originalName,
      expiresAt: doc.expiresAt,
      hasConsent: !!doc.consentVideoPath,
      fileUrl: `http://localhost:5000/${doc.filePath}`,
      consentUrl: doc.consentVideoPath
        ? `http://localhost:5000/${doc.consentVideoPath}`
        : null
    });

  } catch (err) {
    console.error('Access error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 🗑️ Delete document
// =======================
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isDeleted: true }
    );

    log('DELETE', req.user.userId, req.params.id, req.ip, 'Document deleted by user');

    res.json({ message: 'Deleted' });

  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 📊 Get audit logs
// =======================
router.get('/logs', auth, async (req, res) => {
  try {
    const AuditLog = require('../models/AuditLog');

    const docs = await Document.find({ userId: req.user.userId }, '_id');
    const ids = docs.map(d => d._id.toString());

    const logs = await AuditLog.find({
      documentId: { $in: ids }
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(logs);

  } catch (err) {
    console.error('Logs error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;