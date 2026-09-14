const { generateTasksForProject } = require('../services/aiService');
const projectModel = require('../models/Project');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.generateTasks = asyncHandler(async (req, res, next) => {
  const { projectId } = req.body;

  const project = await projectModel.findById(projectId);
  if (!project) return next(new AppError('Project not found.', 404));

  const suggestions = await generateTasksForProject({
    projectName: project.name,
    projectDescription: project.description,
  });

  res.status(200).json({ suggestions });
});