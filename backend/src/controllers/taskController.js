const taskModel = require('../models/Task');
const projectModel = require('../models/Project');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await taskModel.findAll({ projectId: req.query.projectId, status: req.query.status });
  res.status(200).json(tasks);
});

exports.getTaskById = asyncHandler(async (req, res, next) => {
  const task = await taskModel.findById(req.params.id);
  if (!task) return next(new AppError('Task not found.', 404));
  res.status(200).json(task);
});

exports.createTask = asyncHandler(async (req, res, next) => {
  const project = await projectModel.findById(req.body.projectId);
  if (!project) return next(new AppError('projectId does not match any existing project.', 400));
  res.status(201).json(await taskModel.create(req.body));
});

exports.updateTask = asyncHandler(async (req, res, next) => {
  const updated = await taskModel.update(req.params.id, req.body);
  if (!updated) return next(new AppError('Task not found.', 404));
  res.status(200).json(updated);
});

exports.updateTaskStatus = asyncHandler(async (req, res, next) => {
  const updated = await taskModel.update(req.params.id, { status: req.body.status });
  if (!updated) return next(new AppError('Task not found.', 404));
  res.status(200).json(updated);
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const removed = await taskModel.remove(req.params.id);
  if (!removed) return next(new AppError('Task not found.', 404));
  res.status(204).send();
});