const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-otp -otpExpiry');
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name: req.body.name },
      { new: true }
    ).select('-otp -otpExpiry');
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Activity history
router.get('/activity', auth, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.userId }, '_id');
    const ids = docs.map(d => d._id.toString());
    const logs = await AuditLog.find({ documentId: { $in: ids } }).sort({ createdAt: -1 }).limit(30);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;