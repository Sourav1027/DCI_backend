// routes/remarksRoutes.js
const express = require('express');
const router = express.Router();
const remarksController = require('../controller/remarksController');

// Add new remarks
router.post('/:enquiryId',remarksController.addRemarks);

// Get remarks history for an enquiry
router.get('/:enquiryId', remarksController.getRemarksHistory);

module.exports = router;