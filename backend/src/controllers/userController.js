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

exports.updateUser = asyncHandler(async (req, res, next) => {
  if (String(req.params.id) !== String(req.user.id)) {
    return next(new AppError('You can only update your own profile.', 403));
  }
  const updated = await userModel.update(req.params.id, req.body);
  if (!updated) return next(new AppError('User not found.', 404));
  res.status(200).json(updated);
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  if (String(req.params.id) !== String(req.user.id)) {
    return next(new AppError('You can only delete your own account.', 403));
  }
  const removed = await userModel.remove(req.params.id);
  if (!removed) return next(new AppError('User not found.', 404));
  res.status(204).send();
});