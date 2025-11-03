// server/routers/upload.js
const express = require('express');
const router = express.Router();
const { authMiddleware, userOnly } = require('../middleware/auth');

// Example protected upload endpoint
// Uses authMiddleware so blocked users will be rejected (we added block checks there)
// and userOnly so only 'user' role (not admin) can upload.
router.post('/upload', authMiddleware, userOnly, async (req, res) => {
  try {
    // TODO: replace with real upload handling (multer, validation, processing...)
    // For now, accept JSON or form data and respond success.
    return res.json({ success: true, message: 'Upload endpoint reached' });
  } catch (err) {
    console.error('upload route error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
