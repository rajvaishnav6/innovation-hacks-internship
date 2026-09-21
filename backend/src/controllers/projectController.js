const projectModel = require('../models/Project');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectModel.findAll(req.query.status, req.user.id);
  res.status(200).json(projects);
});

exports.getProjectById = asyncHandler(async (req, res, next) => {
  const project = await projectModel.findById(req.params.id);
  if (!project || project.ownerId !== req.user.id) {
    return next(new AppError('Project not found.', 404));
  }
  res.status(200).json(project);
});

exports.createProject = asyncHandler(async (req, res) => {
  const newProject = await projectModel.create({ ...req.body, ownerId: req.user.id });
  res.status(201).json(newProject);
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  const existing = await projectModel.findById(req.params.id);
  if (!existing || existing.ownerId !== req.user.id) {
    return next(new AppError('Project not found.', 404));
  }
  const updated = await projectModel.update(req.params.id, req.body);
  res.status(200).json(updated);
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
  const existing = await projectModel.findById(req.params.id);
  if (!existing || existing.ownerId !== req.user.id) {
    return next(new AppError('Project not found.', 404));
  }
  await projectModel.remove(req.params.id);
  res.status(204).send();
});