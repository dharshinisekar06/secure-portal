const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');
const fs = require('fs');

// Stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalDocs, activeDocs, expiredDocs, totalLogs] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Document.countDocuments({ isDeleted: false }),
      Document.countDocuments({ isDeleted: false, expiresAt: { $gt: new Date() } }),
      Document.countDocuments({ isDeleted: false, expiresAt: { $lt: new Date() } }),
      AuditLog.countDocuments()
    ]);
    res.json({ totalUsers, totalDocs, activeDocs, expiredDocs, totalLogs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// All users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-otp -otpExpiry').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// All documents
router.get('/documents', adminAuth, async (req, res) => {
  try {
    const docs = await Document.find({ isDeleted: false })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete any document
router.delete('/documents/:id', adminAuth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    if (doc.filePath && fs.existsSync(doc.filePath)) fs.unlinkSync(doc.filePath);
    if (doc.consentVideoPath && fs.existsSync(doc.consentVideoPath)) fs.unlinkSync(doc.consentVideoPath);
    doc.isDeleted = true;
    await doc.save();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Document.updateMany({ userId: req.params.id }, { isDeleted: true });
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Audit logs
router.get('/logs', adminAuth, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;