require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const coachRoutes  = require('./routes/coachRoutes');
const blogRoutes   = require('./routes/blogRoutes');
const careerRoutes = require('./routes/careerRoutes');
const transformationRoutes = require('./routes/transformationRoutes');
const adminRoutes  = require('./routes/adminRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────

// CORS — allow frontend and admin panel to make requests
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.startsWith('http://localhost:') || 
                      origin.startsWith('http://127.0.0.1:');
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve admin panel static files (located at root level now)
app.use('/admin', express.static(path.join(__dirname, '..', 'admin-panel')));

// ─── API ROUTES ──────────────────────────────────────

app.use('/api/coaches',  coachRoutes);
app.use('/api/blogs',    blogRoutes);
app.use('/api/careers',  careerRoutes);
app.use('/api/transformations', transformationRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve admin panel SPA — handle all /admin/* routes (located at root level now)
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin-panel', 'index.html'));
});

// ─── ERROR HANDLING ──────────────────────────────────

app.use(errorHandler);

// ─── START SERVER ────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 NLC Backend running on http://localhost:${PORT}`);
  console.log(`📡 API:    http://localhost:${PORT}/api`);
  console.log(`🔐 Admin:  http://localhost:${PORT}/admin`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
});
