const userModel = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllUsers = asyncHandler(async (req, res) => {
  res.status(200).json(await userModel.findAll());
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) return next(new AppError('User not found.', 404));
  res.status(200).json(user);
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const existing = await userModel.findByEmail(req.body.email);
  if (existing) return next(new AppError('A user with this email already exists.', 409));
  res.status(201).json(await userModel.create(req.body));
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const updated = await userModel.update(req.params.id, req.body);
  if (!updated) return next(new AppError('User not found.', 404));
  res.status(200).json(updated);
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const removed = await userModel.remove(req.params.id);
  if (!removed) return next(new AppError('User not found.', 404));
  res.status(204).send();
});