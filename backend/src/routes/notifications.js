const router = require('express').Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(20);
    res.json(notifs);
  } catch (err) {
    console.error('Notifications error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.userId }, { isRead: true });
    res.json({ message: 'Marked all read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;