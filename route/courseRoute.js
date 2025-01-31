const express = require('express');
const courseController = require('../controller/courseController');

const router = express.Router();

// Create Center
router.post('/', courseController.createCourse);

// Get all Courses
router.get('/', courseController.getCourses);

// Get Course by ID
router.get('/:id', courseController.getCourseById);

// Update Course
router.put('/:id', courseController.updateCourse);

// Delete Course
router.delete('/:id', courseController.deleteCourse);

router.patch('/:id/toggle-status',courseController.toggleCourseStatus);



module.exports = router;
 