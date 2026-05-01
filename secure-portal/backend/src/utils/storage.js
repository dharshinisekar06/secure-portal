const multer = require('multer');
const path = require('path');
const fs = require('fs');

const makeStorage = (folder) => {
  const dir = `uploads/${folder}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });
};

exports.docUpload = multer({ storage: makeStorage('documents') });
exports.videoUpload = multer({ storage: makeStorage('consents') });