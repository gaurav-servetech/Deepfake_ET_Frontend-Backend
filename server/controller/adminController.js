// controllers/adminController.js
const User = require('../models/User');

async function listUsers(req, res) {
  try {
    const users = await User.find().select('-password').lean();
    return res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function blockUser(req, res) {
  try {
    const { id } = req.params;
    const { minutes } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBlocked = true;
    user.blockedUntil = minutes && Number(minutes) > 0 ? new Date(Date.now() + Number(minutes) * 60000) : null;
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function unblockUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBlocked = false;
    user.blockedUntil = null;
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// controllers/adminController.js (append)

async function changeUserRole(req, res) {
    try {
      const adminId = req.user?.id; // id of the admin making the request (authMiddleware sets req.user)
      const { id } = req.params; // target user id
      const { role } = req.body; // expected 'user' or 'admin'
  
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }
  
      // prevent admin from changing their own role (avoid accidental lockout)
      if (adminId === id) {
        return res.status(400).json({ success: false, message: 'You cannot change your own role' });
      }
  
      const User = require('../models/User');
  
      // If demoting an admin, ensure there will still be at least one admin left
      if (role === 'user') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({ success: false, message: 'Cannot remove the last admin' });
        }
      }
  
      const updated = await User.findByIdAndUpdate(id, { $set: { role } }, { new: true, select: '-password' });
      if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
  
      return res.json({ success: true, user: { id: updated._id, userName: updated.userName, email: updated.email, role: updated.role } });
    } catch (err) {
      console.error('changeUserRole error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }
  
  module.exports = { listUsers, blockUser, unblockUser, changeUserRole }; // include new export
  


