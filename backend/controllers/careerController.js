const db = require('../config/db');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../middleware/upload');

// ─── PUBLIC ───────────────────────────────────────────

/**
 * GET /api/careers
 * Returns all active job openings.
 */
const getOpenings = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, title, type, location, description, requirements, created_at
       FROM job_openings
       WHERE is_active = true
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/careers/:id
 */
const getOpeningById = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM job_openings WHERE id = $1 AND is_active = true',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Job opening not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/careers/:id/apply
 * Submit a job application with optional resume and multiple certificate uploads.
 */
const applyForJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, additional_info } = req.body;

    // Handle file uploads
    let resume_url = null;
    let certificate_url = null;

    if (req.files) {
      // Upload resume
      if (req.files.resume && req.files.resume[0]) {
        resume_url = await uploadToCloudinary(req.files.resume[0].buffer, 'resumes');
      }
      // Upload multiple certificates
      if (req.files.certificates && req.files.certificates.length > 0) {
        const uploadPromises = req.files.certificates.map(file =>
          uploadToCloudinary(file.buffer, 'certificates')
        );
        const urls = await Promise.all(uploadPromises);
        certificate_url = JSON.stringify(urls); // Store as JSON array
      }
    }

    // Validate the job opening exists and is active
    const job = await db.query('SELECT id FROM job_openings WHERE id = $1 AND is_active = true', [id]);
    if (job.rows.length === 0) {
      return res.status(404).json({ error: 'Job opening not found or no longer active.' });
    }

    // Basic validation
    if (!full_name || !email) {
      return res.status(400).json({ error: 'Full name and email are required.' });
    }
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required.' });
    }
    if (!resume_url && !(req.files && req.files.resume && req.files.resume[0])) {
      return res.status(400).json({ error: 'Resume is required.' });
    }

    const { rows } = await db.query(
      `INSERT INTO job_applications (job_opening_id, full_name, email, phone, resume_url, certificate_url, additional_info)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, full_name, email, created_at`,
      [id, full_name, email, phone, resume_url, certificate_url, additional_info]
    );

    res.status(201).json({ message: 'Application submitted successfully!', application: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN ────────────────────────────────────────────

/**
 * GET /api/admin/careers
 */
const getAllOpenings = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM job_openings ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/careers
 */
const createOpening = async (req, res, next) => {
  try {
    const { title, type, location, description, requirements } = req.body;
    const { rows } = await db.query(
      `INSERT INTO job_openings (title, type, location, description, requirements)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, type || 'Full-time', location || 'On-site', description, requirements]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/careers/:id
 */
const updateOpening = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, type, location, description, requirements, is_active } = req.body;

    const { rows } = await db.query(
      `UPDATE job_openings SET
        title = COALESCE($1, title),
        type = COALESCE($2, type),
        location = COALESCE($3, location),
        description = COALESCE($4, description),
        requirements = COALESCE($5, requirements),
        is_active = COALESCE($6, is_active)
       WHERE id = $7
       RETURNING *`,
      [title, type, location, description, requirements, is_active, id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Opening not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/careers/:id
 */
const deleteOpening = async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM job_openings WHERE id = $1 RETURNING *', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Opening not found' });
    res.json({ message: 'Job opening deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── APPLICATIONS ─────────────────────────────────────

/**
 * GET /api/admin/applications
 * Query params: ?status=pending&job_id=1
 */
const getApplications = async (req, res, next) => {
  try {
    const { status, job_id } = req.query;

    let query = `SELECT ja.*, jo.title as job_title, jo.type as job_type
                 FROM job_applications ja
                 JOIN job_openings jo ON ja.job_opening_id = jo.id`;
    const params = [];
    const conditions = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`ja.status = $${paramIndex++}`);
      params.push(status);
    }
    if (job_id) {
      conditions.push(`ja.job_opening_id = $${paramIndex++}`);
      params.push(parseInt(job_id));
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY ja.created_at DESC';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/applications/:id/status
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const { rows } = await db.query(
      'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Application not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOpenings,
  getOpeningById,
  applyForJob,
  getAllOpenings,
  createOpening,
  updateOpening,
  deleteOpening,
  getApplications,
  updateApplicationStatus,
};
