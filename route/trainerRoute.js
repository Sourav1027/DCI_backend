
const express = require('express');
const router = express.Router();
const trainerController = require('../controller/trainerController');

router.post('/', trainerController.createTrainer);
router.get('/', trainerController.getTrainers);
router.get('/:id', trainerController.getTrainer);
router.put('/:id', trainerController.updateTrainer);
router.delete('/:id', trainerController.deleteTrainer);
router.patch('/:id/status', trainerController.toggleTrainerStatus);


module.exports = router;
