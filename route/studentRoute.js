
const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');

router.post('/', studentController.createStudent);
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.patch('/:id/status', studentController.toggleStudnetStatus);

module.exports = router;
