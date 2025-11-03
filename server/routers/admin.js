// routers/admin.js
const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { listUsers, blockUser, unblockUser,changeUserRole } = require('../controller/adminController');

router.get('/users', authMiddleware, adminOnly, listUsers);
router.post('/block/:id', authMiddleware, adminOnly, blockUser);
router.post('/unblock/:id', authMiddleware, adminOnly, unblockUser);
router.post('/role/:id', authMiddleware, adminOnly, changeUserRole);

module.exports = router;
