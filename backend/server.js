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
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────

// CORS — allow frontend and admin panel to make requests
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:3000'
].map(url => url.replace(/\/$/, '')); // Strip trailing slashes

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    // Normalize origin to remove trailing slash (if any)
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    const isAllowed = allowedOrigins.includes(normalizedOrigin) || 
                      normalizedOrigin.endsWith('.vercel.app') ||
                      normalizedOrigin.startsWith('http://localhost:') || 
                      normalizedOrigin.startsWith('http://127.0.0.1:');
                      
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

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── AUTO MIGRATION (For Production DB Updates) ───────
const db = require('./config/db');
(async () => {
  try {
    console.log('Running automatic schema migrations...');

    // Enquiries table updates
    await db.query(`
      ALTER TABLE enquiries 
      ADD COLUMN IF NOT EXISTS age VARCHAR(10),
      ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
      ADD COLUMN IF NOT EXISTS training_mode VARCHAR(50),
      ADD COLUMN IF NOT EXISTS fitness_goals VARCHAR(255);
    `);
    await db.query(`ALTER TABLE enquiries DROP COLUMN IF EXISTS plan_type;`);

    // Blogs table SEO + alt text updates
    await db.query(`
      ALTER TABLE blogs
      ADD COLUMN IF NOT EXISTS meta_description TEXT,
      ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
      ADD COLUMN IF NOT EXISTS image_alt TEXT;
    `);

    console.log('✅ All migrations completed successfully.');
  } catch (err) {
    console.error('❌ Migration error:', err);
  }
})();

// ─── API ROUTES ──────────────────────────────────────

app.use('/api/coaches',  coachRoutes);
app.use('/api/blogs',    blogRoutes);
app.use('/api/careers',  careerRoutes);
app.use('/api/transformations', transformationRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/reviews',  reviewRoutes);

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
