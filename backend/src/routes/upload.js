const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const Document = require('../models/Document');
const multer = require('multer');
const fs = require('fs');

// =======================
// 📂 Multer Storage Config
// =======================
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const folder =
        file.fieldname === 'document'
          ? 'uploads/documents'
          : 'uploads/consents';

      fs.mkdirSync(folder, { recursive: true });
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
});


// =======================
// 📤 Upload Document + Consent
// =======================
router.post(
  '/',
  auth,
  upload.fields([
    { name: 'document', maxCount: 1 },
    { name: 'consent', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log('FILES:', req.files);
      console.log('BODY:', req.body);
      console.log('USER:', req.user);

      const { expiryMinutes = 60, notifyBefore } = req.body;

      const doc = req.files?.['document']?.[0];

      if (!doc) {
        return res.status(400).json({ error: 'No document file received' });
      }

      const consent = req.files?.['consent']?.[0];

      // 🔥 Expiry calculation
      const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

      // 🔥 Notify calculation (seconds → ms)
      const notifyAt = notifyBefore
        ? new Date(expiresAt - notifyBefore * 1000)
        : null;

      const record = await Document.create({
        userId: req.user.userId,
        filename: doc.filename,
        originalName: doc.originalname,
        filePath: doc.path,
        consentVideoPath: consent?.path || null,
        secureToken: uuidv4(),

        // ✅ UPDATED
        expiresAt,
        notifyBefore: notifyBefore ? parseInt(notifyBefore) : null,

        // 🔥 REQUIRED for cron
        notifyAt,
        isNotified: false
      });

      res.json({
        message: 'Uploaded successfully',
        token: record.secureToken,
        expiresAt: record.expiresAt
      });

    } catch (err) {
      console.error('UPLOAD ERROR:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
);


// =======================
// 📄 Get My Documents
// =======================
router.get('/my-docs', auth, async (req, res) => {
  try {
    const docs = await Document.find({
      userId: req.user.userId,
      isDeleted: false
    });

    res.json(docs);

  } catch (err) {
    console.error('Fetch docs error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;