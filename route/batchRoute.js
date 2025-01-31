const express = require('express');
const batchController = require('../controller/batchController');

const router = express.Router();

// Create Center
router.post('/', batchController.createBatch);

// Get all Courses
router.get('/', batchController.getBatches);

// Get Course by ID
router.get('/:id', batchController.getBatchById);

// Update Course
router.put('/:id', batchController.updateBatch);

// Delete Course
router.delete('/:id', batchController.deleteBatch);

router.patch('/:id/toggle-status',batchController.toggleBatchStatus);


module.exports = router;
 