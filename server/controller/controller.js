// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth')

const JWT_SECRET = process.env.JWT_SECRET || 'CLIENT_SECRET_KEY';
const COOKIE_NAME = 'token';

// register
async function registerUser(req, res) {
  const { userName, email, password, role = 'user' } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const u = new User({ userName, email, password: hashed, role });
    await u.save();
    return res.status(201).json({ success: true, user: { id: u._id, email: u.email, role: u.role, userName: u.userName }});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// login
async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "User doesn't exist" });

     // after: const user = await User.findOne({ email });
if (!user) return res.status(401).json({ success: false, message: "User doesn't exist" });

// BLOCK CHECK - handle indefinite and timed blocks properly
if (user.isBlocked) {
  const now = Date.now();

  if (user.blockedUntil) {
    // timed block: still active?
    if (new Date(user.blockedUntil).getTime() > now) {
      return res.status(403).json({
        success: false,
        message: `Account is blocked until ${new Date(user.blockedUntil).toLocaleString()}`,
        blockedUntil: user.blockedUntil
      });
    }
    // timed block expired -> clear and continue
    user.isBlocked = false;
    user.blockedUntil = null;
    await user.save();
  } else {
    // No blockedUntil => indefinite block -> deny login
    return res.status(403).json({
      success: false,
      message: 'Account is blocked (indefinite)',
      blockedUntil: null
    });
  }
}


    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Incorrect password' });

    const payload = { id: user._id, role: user.role, email: user.email, userName: user.userName };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    // Dev cookie: secure: false, sameSite: 'lax'. In production use secure: true & sameSite: 'none'
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Logged in successfully',
      user: { id: user._id, email: user.email, role: user.role, userName: user.userName }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// logout
function logoutUser(req, res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  return res.json({ success: true, message: 'Logged out' });
}

// check-auth
// in controllers/authController.js -> checkAuth
async function checkAuth(req, res) {
  // authMiddleware populates req.user
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorised' });
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorised' });

  return res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      userName: user.userName,
      isBlocked: !!user.isBlocked,
      blockedUntil: user.blockedUntil || null
    }
  });
}


module.exports = { registerUser, loginUser, logoutUser, checkAuth };
