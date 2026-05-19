const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../middleware/upload');

// ─── PUBLIC ───────────────────────────────────────────

/**
 * GET /api/coaches
 * Returns all active coaches ordered by display_order.
 */
const getCoaches = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, title, image_url, transformations, hours, specialty, description, bio, start_date, end_date
       FROM coaches
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
 * GET /api/admin/coaches
 * Returns ALL coaches (including inactive) for admin management.
 */
const getAllCoaches = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM coaches ORDER BY display_order ASC, created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/coaches/:id
 */
const getCoachById = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM coaches WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Coach not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/coaches
 * Create a new coach. Image is uploaded via multer middleware.
 */
const createCoach = async (req, res, next) => {
  try {
    const { name, title, transformations, hours, specialty, description, bio, start_date, end_date, display_order } = req.body;
    const image_url = req.file ? await uploadToCloudinary(req.file.buffer, 'coaches') : null;

    const { rows } = await db.query(
      `INSERT INTO coaches (name, title, image_url, transformations, hours, specialty, description, bio, start_date, end_date, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name, title, image_url, transformations, hours, specialty, description, bio || null, start_date || null, end_date || null, display_order || 0]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/coaches/:id
 * Update an existing coach. Optionally upload a new image.
 */
const updateCoach = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, title, transformations, hours, specialty, description, bio, start_date, end_date, display_order, is_active } = req.body;

    // If a new image was uploaded, use its URL
    let image_url;
    if (req.file) {
      image_url = await uploadToCloudinary(req.file.buffer, 'coaches');

      // Delete old image from Cloudinary
      const old = await db.query('SELECT image_url FROM coaches WHERE id = $1', [id]);
      if (old.rows[0]?.image_url) {
        const publicId = old.rows[0].image_url.split('/').slice(-2).join('/').split('.')[0];
        try { await cloudinary.uploader.destroy(publicId); } catch(e) { /* ignore */ }
      }
    }

    const { rows } = await db.query(
      `UPDATE coaches SET
        name = COALESCE($1, name),
        title = COALESCE($2, title),
        image_url = COALESCE($3, image_url),
        transformations = COALESCE($4, transformations),
        hours = COALESCE($5, hours),
        specialty = COALESCE($6, specialty),
        description = COALESCE($7, description),
        bio = COALESCE($8, bio),
        start_date = COALESCE($9, start_date),
        end_date = COALESCE($10, end_date),
        display_order = COALESCE($11, display_order),
        is_active = COALESCE($12, is_active)
       WHERE id = $13
       RETURNING *`,
      [name, title, image_url, transformations, hours, specialty, description, bio, start_date || null, end_date || null, display_order, is_active, id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Coach not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/coaches/:id
 * Permanently delete a coach and their Cloudinary image.
 */
const deleteCoach = async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM coaches WHERE id = $1 RETURNING *', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Coach not found' });

    // Clean up Cloudinary image
    if (rows[0].image_url) {
      const publicId = rows[0].image_url.split('/').slice(-2).join('/').split('.')[0];
      try { await cloudinary.uploader.destroy(publicId); } catch(e) { /* ignore */ }
    }

    res.json({ message: 'Coach deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCoaches,
  getAllCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
};
