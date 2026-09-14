const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserUpdate } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', validateUserUpdate, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;