const express = require('express');
const router = express.Router();
const { getCoaches } = require('../controllers/coachController');

// GET /api/coaches — Public
router.get('/', getCoaches);

module.exports = router;
