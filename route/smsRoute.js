const express = require('express');
const router = express.Router();
const smsController = require('../controller/smsController');

router.post('/', smsController.createSMS);
router.get('/', smsController.getSMS);
router.get('/:id', smsController.getSMSById);
router.put('/:id', smsController.updateSMS);
router.delete('/:id', smsController.deleteSMS);
router.patch('/toggle-status/:id', smsController.toggleSMSStatus);

module.exports = router;