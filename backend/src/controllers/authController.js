const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existing = await userModel.findByEmail(email);
  if (existing) return next(new AppError('A user with this email already exists.', 409));

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({ name, email, password: hashedPassword });

  res.status(201).json({ user: newUser, token: generateToken(newUser.id) });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findByEmailWithPassword(email);
  if (!user) return next(new AppError('Invalid email or password.', 401));

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return next(new AppError('Invalid email or password.', 401));

  const { password: _removed, ...safeUser } = user;
  res.status(200).json({ user: safeUser, token: generateToken(user.id) });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});