const express = require('express');
const userController = require('../controller/useController');
const { validateUser } = require('../utils/validation');

const router = express.Router();

router.post('/', validateUser, userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', validateUser, userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
