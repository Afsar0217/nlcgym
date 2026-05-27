const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../middleware/upload');
const slugify = require('slugify');

// ─── HELPERS ──────────────────────────────────────────

const generateSlug = (title) => {
  return slugify(title, { lower: true, strict: true, trim: true });
};

/**
 * Ensure slug is unique by appending a number if needed.
 */
const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = excludeId
      ? 'SELECT id FROM blogs WHERE slug = $1 AND id != $2'
      : 'SELECT id FROM blogs WHERE slug = $1';
    const params = excludeId ? [slug, excludeId] : [slug];
    const { rows } = await db.query(query, params);

    if (rows.length === 0) return slug;
    slug = `${baseSlug}-${counter++}`;
  }
};

// ─── PUBLIC ───────────────────────────────────────────

/**
 * GET /api/blogs
 * Query params: ?category=Recovery&featured=true&limit=10&offset=0
 */
const getBlogs = async (req, res, next) => {
  try {
    const { category, featured, limit = 50, offset = 0 } = req.query;

    let query = `SELECT id, title, slug, summary, image_url, image_alt, category, author_name,
                        meta_description, meta_keywords, is_featured, published_at
                 FROM blogs WHERE is_published = true`;
    const params = [];
    let paramIndex = 1;

    if (category && category !== 'All') {
      query += ` AND category = $${paramIndex++}`;
      params.push(category);
    }

    if (featured === 'true') {
      query += ` AND is_featured = true`;
    }

    query += ` ORDER BY is_featured DESC, published_at DESC`;
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await db.query(query, params);

    // Also get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM blogs WHERE is_published = true`;
    const countParams = [];
    let ci = 1;
    if (category && category !== 'All') {
      countQuery += ` AND category = $${ci++}`;
      countParams.push(category);
    }
    const countResult = await db.query(countQuery, countParams);

    res.json({
      blogs: rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/blogs/:slug
 * Get a single blog post by slug.
 */
const getBlogBySlug = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM blogs WHERE slug = $1 AND is_published = true`,
      [req.params.slug]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/blogs/categories
 * Returns distinct categories for filter buttons.
 */
const getCategories = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT DISTINCT category FROM blogs WHERE is_published = true ORDER BY category`
    );
    res.json(rows.map(r => r.category));
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN ────────────────────────────────────────────

/**
 * GET /api/admin/blogs
 */
const getAllBlogs = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM blogs ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/blogs/:id
 */
const getBlogById = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM blogs WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/blogs
 */
const createBlog = async (req, res, next) => {
  try {
    const { title, summary, content, category, author_name, author_bio, image_alt, meta_description, meta_keywords, is_featured, is_published } = req.body;
    const image_url = req.file ? await uploadToCloudinary(req.file.buffer, 'blogs') : null;
    const slug = await ensureUniqueSlug(generateSlug(title));

    const { rows } = await db.query(
      `INSERT INTO blogs (title, slug, summary, content, image_url, image_alt, category, author_name, author_bio, meta_description, meta_keywords, is_featured, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [title, slug, summary, content, image_url, image_alt, category || 'General', author_name || 'NLC Team', author_bio,
       meta_description, meta_keywords,
       is_featured === 'true' || is_featured === true,
       is_published === 'false' ? false : true,
       new Date()]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/blogs/:id
 */
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, summary, content, category, author_name, author_bio, image_alt, meta_description, meta_keywords, is_featured, is_published } = req.body;

    let image_url;
    if (req.file) {
      image_url = await uploadToCloudinary(req.file.buffer, 'blogs');
      // Delete old image
      const old = await db.query('SELECT image_url FROM blogs WHERE id = $1', [id]);
      if (old.rows[0]?.image_url) {
        const publicId = old.rows[0].image_url.split('/').slice(-2).join('/').split('.')[0];
        try { await cloudinary.uploader.destroy(publicId); } catch(e) { /* ignore */ }
      }
    }

    // If title changed, update slug
    let slug;
    if (title) {
      slug = await ensureUniqueSlug(generateSlug(title), id);
    }

    const { rows } = await db.query(
      `UPDATE blogs SET
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        summary = COALESCE($3, summary),
        content = COALESCE($4, content),
        image_url = COALESCE($5, image_url),
        image_alt = COALESCE($6, image_alt),
        category = COALESCE($7, category),
        author_name = COALESCE($8, author_name),
        author_bio = COALESCE($9, author_bio),
        meta_description = COALESCE($10, meta_description),
        meta_keywords = COALESCE($11, meta_keywords),
        is_featured = COALESCE($12, is_featured),
        is_published = COALESCE($13, is_published)
       WHERE id = $14
       RETURNING *`,
      [title, slug, summary, content, image_url, image_alt, category, author_name, author_bio, meta_description, meta_keywords,
       is_featured === 'true' ? true : is_featured === 'false' ? false : undefined,
       is_published === 'true' ? true : is_published === 'false' ? false : undefined,
       id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/blogs/:id
 */
const deleteBlog = async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM blogs WHERE id = $1 RETURNING *', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Blog not found' });

    if (rows[0].image_url) {
      const publicId = rows[0].image_url.split('/').slice(-2).join('/').split('.')[0];
      try { await cloudinary.uploader.destroy(publicId); } catch(e) { /* ignore */ }
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getCategories,
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
