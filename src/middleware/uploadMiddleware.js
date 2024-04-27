const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('files'); // Changed to array

const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Error uploading files:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    next();
  });
};

module.exports = uploadMiddleware;
