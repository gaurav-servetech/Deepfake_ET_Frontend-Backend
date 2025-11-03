// models/User.js (example)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum:["user" , "admin"], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  blockedUntil: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
