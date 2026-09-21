const taskModel = require('../models/Task');
const projectModel = require('../models/Project');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

async function assertOwnsTaskProject(task, userId) {
  if (!task) return false;
  const project = await projectModel.findById(task.projectId);
  return !!project && project.ownerId === userId;
}

exports.getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await taskModel.findAll({
    projectId: req.query.projectId,
    status: req.query.status,
    ownerId: req.user.id,
  });
  res.status(200).json(tasks);
});

exports.getTaskById = asyncHandler(async (req, res, next) => {
  const task = await taskModel.findById(req.params.id);
  if (!(await assertOwnsTaskProject(task, req.user.id))) {
    return next(new AppError('Task not found.', 404));
  }
  res.status(200).json(task);
});

exports.createTask = asyncHandler(async (req, res, next) => {
  const project = await projectModel.findById(req.body.projectId);
  if (!project || project.ownerId !== req.user.id) {
    return next(new AppError('projectId does not match any of your projects.', 400));
  }
  const newTask = await taskModel.create(req.body);
  res.status(201).json(newTask);
});

exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await taskModel.findById(req.params.id);
  if (!(await assertOwnsTaskProject(task, req.user.id))) {
    return next(new AppError('Task not found.', 404));
  }
  const updated = await taskModel.update(req.params.id, req.body);
  res.status(200).json(updated);
});

exports.updateTaskStatus = asyncHandler(async (req, res, next) => {
  const task = await taskModel.findById(req.params.id);
  if (!(await assertOwnsTaskProject(task, req.user.id))) {
    return next(new AppError('Task not found.', 404));
  }
  const updated = await taskModel.update(req.params.id, { status: req.body.status });
  res.status(200).json(updated);
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await taskModel.findById(req.params.id);
  if (!(await assertOwnsTaskProject(task, req.user.id))) {
    return next(new AppError('Task not found.', 404));
  }
  await taskModel.remove(req.params.id);
  res.status(204).send();
});