// server.js (or app.js)
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const auth = require("./routers/auth-route");
const adminRoute = require('./routers/admin')
const uploadRoute = require('./routers/upload');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => console.log('mongoDB connected')).catch(e => console.error(e));

app.use(express.json());
app.use(cookieParser());

// CORS: allow frontend origin and credentials
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/auth', auth);
app.use('/api/admin', adminRoute)
app.use('/api', uploadRoute)

// example protected admin route
app.get('/api/admin/data', require('./middleware/auth').authMiddleware, require('./middleware/auth').adminOnly, (req, res) => {
  res.json({ secret: 'admin only data' });
});

app.listen(PORT, () => console.log('server running on', PORT));
