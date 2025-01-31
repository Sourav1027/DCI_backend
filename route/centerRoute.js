const express = require('express');
const centerController = require('../controller/centerController');

const router = express.Router();

// Create Center
router.post('/', centerController.createCenter);

// Get all Centers
router.get('/', centerController.getCenters);

// Get Center by ID
router.get('/:id', centerController.getCenterById);

// Update Center
router.put('/:id', centerController.updateCenter);

// Delete Center
router.delete('/:id', centerController.deleteCenter);

// Suspend Center
router.put('/:id/suspend', centerController.suspendCenter); // New route for suspend

// Unsuspend Center
router.put('/:id/unsuspend', centerController.unsuspendCenter); // New route for unsuspend

module.exports = router;
