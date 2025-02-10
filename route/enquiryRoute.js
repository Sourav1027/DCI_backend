
const express = require('express');
const router = express.Router();
const enquiryController = require('../controller/enquiryController');

router.post('/', enquiryController.createEnquiry);
router.get('/', enquiryController.getEnquiry);
router.get('/:id', enquiryController.getEnquirybyID);
router.put('/:id', enquiryController.updateEnquiry);
router.delete('/:id', enquiryController.deleteEnquiry);
router.patch('/:id/status', enquiryController.toggleEnquiryStatus);

module.exports = router;
