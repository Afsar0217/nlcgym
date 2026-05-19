const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../middleware/upload');

// ─── PUBLIC ───────────────────────────────────────────

/**
 * GET /api/transformations
 * Returns all active transformations ordered by display_order.
 */
const getTransformations = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, title, image_url, description, rating, metrics, review
       FROM transformations
       WHERE is_active = true
       ORDER BY display_order ASC, created_at ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN ────────────────────────────────────────────

/**
 * GET /api/admin/transformations
 */
const getAllTransformations = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM transformations ORDER BY display_order ASC, created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/transformations/:id
 */
const getTransformationById = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM transformations WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Transformation not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/transformations
 */
const createTransformation = async (req, res, next) => {
  try {
    const { name, title, description, rating, metrics, review } = req.body;
    const image_url = req.file ? await uploadToCloudinary(req.file.buffer, 'transformations') : null;

    // Auto-calculate display_order: next available position
    const countResult = await db.query('SELECT COUNT(*) FROM transformations WHERE is_active = true');
    const display_order = parseInt(countResult.rows[0].count) + 1;

    const { rows } = await db.query(
      `INSERT INTO transformations (name, title, image_url, description, rating, metrics, review, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, title, image_url, description, parseInt(rating) || 5, metrics, review, display_order]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/transformations/:id
 */
const updateTransformation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, title, description, rating, metrics, review, is_active } = req.body;

    let image_url;
    if (req.file) {
      image_url = await uploadToCloudinary(req.file.buffer, 'transformations');

      const old = await db.query('SELECT image_url FROM transformations WHERE id = $1', [id]);
      if (old.rows[0]?.image_url) {
        const publicId = old.rows[0].image_url.split('/').slice(-2).join('/').split('.')[0];
        try { await cloudinary.uploader.destroy(publicId); } catch(e) { /* ignore */ }
      }
    }

    const { rows } = await db.query(
      `UPDATE transformations SET
        name = COALESCE($1, name),
        title = COALESCE($2, title),
        image_url = COALESCE($3, image_url),
        description = COALESCE($4, description),
        rating = COALESCE($5, rating),
        metrics = COALESCE($6, metrics),
        review = COALESCE($7, review),
        is_active = COALESCE($8, is_active)
       WHERE id = $9
       RETURNING *`,
      [name, title, image_url, description, rating ? parseInt(rating) : null, metrics, review, is_active, id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Transformation not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/transformations/:id
 */
const deleteTransformation = async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM transformations WHERE id = $1 RETURNING *', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Transformation not found' });

    if (rows[0].image_url) {
      const publicId = rows[0].image_url.split('/').slice(-2).join('/').split('.')[0];
      try { await cloudinary.uploader.destroy(publicId); } catch(e) { /* ignore */ }
    }

    // Re-order remaining transformations
    await db.query(`
      WITH ordered AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY display_order ASC, created_at ASC) as new_order
        FROM transformations WHERE is_active = true
      )
      UPDATE transformations SET display_order = ordered.new_order
      FROM ordered WHERE transformations.id = ordered.id
    `);

    res.json({ message: 'Transformation deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTransformations,
  getAllTransformations,
  getTransformationById,
  createTransformation,
  updateTransformation,
  deleteTransformation,
};
