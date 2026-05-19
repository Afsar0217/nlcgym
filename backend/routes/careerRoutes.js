const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { getOpenings, getOpeningById, applyForJob } = require('../controllers/careerController');

// GET /api/careers — Public
router.get('/', getOpenings);

// GET /api/careers/:id — Public
router.get('/:id', getOpeningById);

// POST /api/careers/:id/apply — Public (with resume + certificates upload)
router.post('/:id/apply', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'certificates', maxCount: 5 }
]), applyForJob);

module.exports = router;
