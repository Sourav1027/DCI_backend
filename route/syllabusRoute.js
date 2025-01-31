const express = require('express');
const syllabusController = require('../controller/syllabusController');

const router = express.Router();

// Create syllabus
router.post('/', syllabusController.createSyllabus);

// Get all syllabus
router.get('/', syllabusController.getsyllabus);

// Get syllabus by ID
router.get('/:id', syllabusController.getsyllabusbyId);

// Update syllabus
router.put('/:id', syllabusController.updatesyllabus);

// Delete syllabus
router.delete('/:id', syllabusController.deletesyllabus);

router.patch('/:id/toggle-status',syllabusController.toggleSyllabusStatus);


module.exports = router;
 