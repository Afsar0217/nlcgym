const express = require('express');
const router = express.Router();
const { submitEnquiry, getEnquiries, updateEnquiryStatus } = require('../controllers/enquiryController');
const auth = require('../middleware/auth');

router.post('/', submitEnquiry);
router.get('/', auth, getEnquiries);
router.put('/:id', auth, updateEnquiryStatus);

module.exports = router;
