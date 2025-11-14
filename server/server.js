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


// --------------------------------------------------------------------------------------------
// // server.js (updated for CORS)
// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();
// const auth = require("./routers/auth-route");
// const adminRoute = require('./routers/admin');
// const uploadRoute = require('./routers/upload');

// const app = express();
// const PORT = process.env.PORT || 5000;

// const uri = process.env.MONGO_URI;
// if (!uri) {
//   console.error('MONGO_URI not set in .env');
//   process.exit(1);
// }

// mongoose.connect(uri)
//   .then(() => console.log('mongoDB connected'))
//   .catch(err => {
//     console.error('mongo connect error', err);
//     // keep process alive for debugging — optionally exit in prod
//   });

// mongoose.connection.on('connected', () => console.log('Mongoose connected'));
// mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
// mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// app.use(express.json());
// app.use(cookieParser());

// /*
//   CORS configuration:
//   - Allow your frontend host(s) explicitly (not '*') when using credentials
//   - Handle preflight (OPTIONS) requests
//   - Allow server-to-server requests with no origin
// */

// // Build allowed origins list
// const allowedOrigins = new Set();

// // Add explicit known domains (update these if your frontend domain changes)
// allowedOrigins.add('https://app.elevatetrust.ai');     // your subdomain frontend
// allowedOrigins.add('https://elevatetrust.ai');         // main domain (if used)

// // If you have FRONTEND_URL in env (e.g. https://app.elevatetrust.ai), include it
// if (process.env.FRONTEND_URL) {
//   // Normalise: allow provided value as-is
//   allowedOrigins.add(process.env.FRONTEND_URL);
//   // if env contains hostname only, also add https://... 
//   // (but typically FRONTEND_URL will already be full origin)
// }

// // Include Render platform service URL (if present)
// if (process.env.RENDER_EXTERNAL_URL) {
//   // Render service URL might not be prefixed with https - ensure full origin
//   let renderUrl = process.env.RENDER_EXTERNAL_URL;
//   if (!/^https?:\/\//i.test(renderUrl)) renderUrl = `https://${renderUrl}`;
//   allowedOrigins.add(renderUrl);
// }

// // Local dev origins
// allowedOrigins.add('http://localhost:3000');
// allowedOrigins.add('http://127.0.0.1:3000');
// allowedOrigins.add('http://localhost:5173'); // vite dev (if you use it)
// allowedOrigins.add('http://127.0.0.1:5173');

// console.log('Allowed CORS origins:', Array.from(allowedOrigins));

// app.use(cors({
//   origin: function(origin, callback) {
//     // allow requests with no origin (like curl, Postman, server-to-server)
//     if (!origin) {
//       return callback(null, true);
//     }
//     if (allowedOrigins.has(origin)) {
//       return callback(null, true);
//     }
//     // otherwise block
//     return callback(new Error('CORS blocked: origin not allowed'), false);
//   },
//   credentials: true, // allow cookies if you need them
//   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization','X-Requested-With', 'Accept']
// }));

// // // Ensure preflight OPTIONS requests return proper headers immediately
// // app.options('/*', cors({
// //   origin: function(origin, callback) {
// //     if (!origin) return callback(null, true);
// //     if (allowedOrigins.has(origin)) return callback(null, true);
// //     return callback(new Error('CORS blocked: origin not allowed'), false);
// //   },
// //   credentials: true
// // }));

// // Handle preflight requests globally
// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Origin', req.headers.origin);
//     res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     return res.sendStatus(204);
//   }
//   next();
// });


// // Routes
// app.use('/api/auth', auth);
// app.use('/api/admin', adminRoute);
// app.use('/api', uploadRoute);

// // example protected admin route
// app.get('/api/admin/data',
//   require('./middleware/auth').authMiddleware,
//   require('./middleware/auth').adminOnly,
//   (req, res) => {
//     res.json({ secret: 'admin only data' });
//   }
// );

// // Generic error handler to show CORS errors in logs (optional)
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err && err.message ? err.message : err);
//   if (err && err.message && err.message.includes('CORS')) {
//     return res.status(403).json({ message: err.message });
//   }
//   res.status(500).json({ message: 'Internal server error' });
// });

// app.listen(PORT, () => console.log('server running on', PORT));
// ------------------------------------------------------------------------------------------------------

// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// // Routers
// const auth = require("./routers/auth-route");
// const adminRoute = require('./routers/admin');
// const uploadRoute = require('./routers/upload');

// const app = express();
// const PORT = 5000; // backend runs on 5000 (frontend is 5175)

// // Connect MongoDB
// const uri = process.env.MONGO_URI;
// if (!uri) {
//   console.error('❌ MONGO_URI not set in .env');
//   process.exit(1);
// }

// mongoose.connect(uri)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// mongoose.connection.on('connected', () => console.log('Mongoose connected'));
// mongoose.connection.on('error', (err) => console.error('Mongoose error:', err));
// mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// app.use(express.json());
// app.use(cookieParser());

// // ✅ Fixed CORS — allow only your frontend on port 5175
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));

// // ✅ Middleware for preflight requests (OPTIONAL but safe)
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(204);
//   }
//   next();
// });

// // ✅ Routes
// app.use('/api/auth', auth);
// app.use('/api/admin', adminRoute);
// app.use('/api', uploadRoute);

// // ✅ Example protected admin route
// app.get('/api/admin/data',
//   require('./middleware/auth').authMiddleware,
//   require('./middleware/auth').adminOnly,
//   (req, res) => {
//     res.json({ secret: 'admin only data' });
//   }
// );

// // ✅ Error handler (useful for debugging CORS)
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err.message || err);
//   if (err && err.message && err.message.includes('CORS')) {
//     return res.status(403).json({ message: err.message });
//   }
//   res.status(500).json({ message: 'Internal server error' });
// });

// // ✅ Start server
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
