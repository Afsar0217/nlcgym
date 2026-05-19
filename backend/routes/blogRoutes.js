const express = require('express');
const router = express.Router();
const { getBlogs, getBlogBySlug, getCategories } = require('../controllers/blogController');

// GET /api/blogs — Public (with filters & pagination)
router.get('/', getBlogs);

// GET /api/blogs/categories — Public
router.get('/categories', getCategories);

// GET /api/blogs/:slug — Public (single blog)
router.get('/:slug', getBlogBySlug);

module.exports = router;
