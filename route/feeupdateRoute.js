const express = require('express');
const router = express.Router();
const feeUpdateController = require("../controller/feeUpdateController");

// Create Fee Update
router.post('/create', feeUpdateController.createFee);
router.get('/list', feeUpdateController.getFees);
router.get('/:id', feeUpdateController.getFeeById);
router.put('/update/:id', feeUpdateController.updateFee);
router.delete('/delete/:id', feeUpdateController.deleteFee);

module.exports = router;
