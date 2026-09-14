const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validateProjectCreate, validateProjectUpdate } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', validateProjectCreate, projectController.createProject);
router.put('/:id', validateProjectUpdate, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;