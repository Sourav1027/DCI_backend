const express = require('express');
const router = express.Router();
const skillController = require('../controller/skillMarkController');

// Create a new skill entry
router.post('/', skillController.createSkill);

// Get all skills with pagination and search
router.get('/', skillController.getSkills);

// Get a single skill by ID
router.get('/:id', skillController.getSkillByID);

// Update a skill by ID
router.put('/:id', skillController.updateSkill);

// Delete a skill by ID
router.delete('/:id', skillController.deleteSkill);

// Toggle skill status (Activate/Deactivate)
router.patch('/toggle-status/:id', skillController.toggleSkillStatus);

module.exports = router;
