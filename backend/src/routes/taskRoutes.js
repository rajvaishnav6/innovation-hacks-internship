const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTaskCreate, validateTaskUpdate, validateTaskStatus } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateTaskCreate, taskController.createTask);
router.put('/:id', validateTaskUpdate, taskController.updateTask);
router.patch('/:id/status', validateTaskStatus, taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;