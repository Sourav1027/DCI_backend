const express = require('express');
const loginController = require('../controller/loginController');
const router = express.Router();

// Login Route
router.post('/', loginController.login);

module.exports = router;
