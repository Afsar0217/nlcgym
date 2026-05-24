const db = require('../config/db');

// @desc    Submit a new enquiry
// @route   POST /api/enquiries
// @access  Public
const submitEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, age, gender, training_mode, fitness_goals, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email and phone are required' });
    }

    const newEnquiry = await db.query(
      `INSERT INTO enquiries (name, email, phone, age, gender, training_mode, fitness_goals, message) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, email, phone, age || null, gender || null, training_mode || null, fitness_goals || null, message || null]
    );

    res.status(201).json({
      success: true,
      data: newEnquiry.rows[0],
      message: 'Thank you for showing interest! We will get back to you soon, eager to welcome you into our gym family.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getEnquiries = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const updated = await db.query(
      'UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json(updated.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEnquiry,
  getEnquiries,
  updateEnquiryStatus
};
