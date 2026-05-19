const express = require('express');
const router = express.Router();
const { getTransformations } = require('../controllers/transformationController');

// GET /api/transformations — public
router.get('/', getTransformations);

module.exports = router;
