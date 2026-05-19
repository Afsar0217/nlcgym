const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Controllers
const { getAllCoaches, getCoachById, createCoach, updateCoach, deleteCoach } = require('../controllers/coachController');
const { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { getAllOpenings, createOpening, updateOpening, deleteOpening, getApplications, updateApplicationStatus } = require('../controllers/careerController');
const { getAllTransformations, getTransformationById, createTransformation, updateTransformation, deleteTransformation } = require('../controllers/transformationController');
const { getEnquiries, updateEnquiryStatus } = require('../controllers/enquiryController');

// ─── AUTH ─────────────────────────────────────────────

/**
 * POST /api/admin/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Compare with env credentials
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // For first-time setup, compare plain text. In production, hash the password.
    const isMatch = password === process.env.ADMIN_PASSWORD;
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, admin: { email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

/**
 * GET /api/admin/verify
 * Verify if the current token is still valid.
 */
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

/**
 * GET /api/admin/dashboard
 * Returns summary counts for the admin dashboard.
 */
router.get('/dashboard', auth, async (req, res, next) => {
  try {
    const db = require('../config/db');
    const [coaches, blogs, openings, applications] = await Promise.all([
      db.query('SELECT COUNT(*) FROM coaches WHERE is_active = true'),
      db.query('SELECT COUNT(*) FROM blogs WHERE is_published = true'),
      db.query('SELECT COUNT(*) FROM job_openings WHERE is_active = true'),
      db.query('SELECT COUNT(*) FROM job_applications WHERE status = $1', ['pending']),
    ]);

    res.json({
      totalCoaches: parseInt(coaches.rows[0].count),
      totalBlogs: parseInt(blogs.rows[0].count),
      totalOpenings: parseInt(openings.rows[0].count),
      pendingApplications: parseInt(applications.rows[0].count),
    });
  } catch (err) {
    next(err);
  }
});

// ─── COACHES CRUD ─────────────────────────────────────
router.get('/coaches', auth, getAllCoaches);
router.get('/coaches/:id', auth, getCoachById);
router.post('/coaches', auth, upload.single('image'), createCoach);
router.put('/coaches/:id', auth, upload.single('image'), updateCoach);
router.delete('/coaches/:id', auth, deleteCoach);

// ─── BLOGS CRUD ───────────────────────────────────────
router.get('/blogs', auth, getAllBlogs);
router.get('/blogs/:id', auth, getBlogById);
router.post('/blogs', auth, upload.single('image'), createBlog);
router.put('/blogs/:id', auth, upload.single('image'), updateBlog);
router.delete('/blogs/:id', auth, deleteBlog);

// ─── CAREERS CRUD ─────────────────────────────────────
router.get('/careers', auth, getAllOpenings);
router.post('/careers', auth, createOpening);
router.put('/careers/:id', auth, updateOpening);
router.delete('/careers/:id', auth, deleteOpening);

// ─── APPLICATIONS ─────────────────────────────────────
router.get('/applications', auth, getApplications);
router.put('/applications/:id/status', auth, updateApplicationStatus);

// ─── TRANSFORMATIONS CRUD ─────────────────────────────
router.get('/transformations', auth, getAllTransformations);
router.get('/transformations/:id', auth, getTransformationById);
router.post('/transformations', auth, upload.single('image'), createTransformation);
router.put('/transformations/:id', auth, upload.single('image'), updateTransformation);
router.delete('/transformations/:id', auth, deleteTransformation);

// ─── ENQUIRIES ─────────────────────────────────────
router.get('/enquiries', auth, getEnquiries);
router.put('/enquiries/:id/status', auth, updateEnquiryStatus);

module.exports = router;
