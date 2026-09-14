const projectModel = require('../models/Project');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllProjects = asyncHandler(async (req, res) => {
  res.status(200).json(await projectModel.findAll(req.query.status));
});

exports.getProjectById = asyncHandler(async (req, res, next) => {
  const project = await projectModel.findById(req.params.id);
  if (!project) return next(new AppError('Project not found.', 404));
  res.status(200).json(project);
});

exports.createProject = asyncHandler(async (req, res) => {
  const newProject = await projectModel.create({ ...req.body, ownerId: req.user.id });
  res.status(201).json(newProject);
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  const updated = await projectModel.update(req.params.id, req.body);
  if (!updated) return next(new AppError('Project not found.', 404));
  res.status(200).json(updated);
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
  const removed = await projectModel.remove(req.params.id);
  if (!removed) return next(new AppError('Project not found.', 404));
  // Iske tasks ko manually delete karne ki zaroorat nahi -
  // database khud "ON DELETE CASCADE" se kar deta hai.
  res.status(204).send();
});