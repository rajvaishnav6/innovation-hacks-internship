const AppError = require('../utils/AppError');
const { isNonEmptyString, isValidEmail, isValidDate, isOneOf } = require('../utils/validators');

const PROJECT_STATUSES = ['Planning', 'In Progress', 'Completed', 'On Hold'];
const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];
const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

function fail(next, details) {
  const err = new AppError('Validation failed.', 400);
  err.details = details;
  next(err);
}

function validateUserUpdate(req, res, next) {
  const { name, email } = req.body;
  const errors = [];
  if (name !== undefined && !isNonEmptyString(name)) errors.push('name must be a non-empty string.');
  if (email !== undefined && !isValidEmail(email)) errors.push('email must be a valid email address.');
  if (errors.length) return fail(next, errors);
  next();
}

function validateProjectCreate(req, res, next) {
  const { name, status, dueDate } = req.body;
  const errors = [];
  if (!isNonEmptyString(name)) errors.push('name is required and must be a non-empty string.');
  if (status !== undefined && !isOneOf(status, PROJECT_STATUSES)) {
    errors.push(`status must be one of: ${PROJECT_STATUSES.join(', ')}.`);
  }
  if (dueDate !== undefined && dueDate !== null && !isValidDate(dueDate)) {
    errors.push('dueDate must be a valid date.');
  }
  if (errors.length) return fail(next, errors);
  next();
}

function validateProjectUpdate(req, res, next) {
  const { name, status, dueDate } = req.body;
  const errors = [];
  if (name !== undefined && !isNonEmptyString(name)) errors.push('name must be a non-empty string.');
  if (status !== undefined && !isOneOf(status, PROJECT_STATUSES)) {
    errors.push(`status must be one of: ${PROJECT_STATUSES.join(', ')}.`);
  }
  if (dueDate !== undefined && dueDate !== null && !isValidDate(dueDate)) {
    errors.push('dueDate must be a valid date.');
  }
  if (errors.length) return fail(next, errors);
  next();
}

function validateTaskCreate(req, res, next) {
  const { title, projectId, status, priority, dueDate } = req.body;
  const errors = [];
  if (!isNonEmptyString(title)) errors.push('title is required and must be a non-empty string.');
  if (!isNonEmptyString(projectId) && typeof projectId !== 'number') errors.push('projectId is required.');
  if (status !== undefined && !isOneOf(status, TASK_STATUSES)) {
    errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}.`);
  }
  if (priority !== undefined && !isOneOf(priority, TASK_PRIORITIES)) {
    errors.push(`priority must be one of: ${TASK_PRIORITIES.join(', ')}.`);
  }
  if (dueDate !== undefined && dueDate !== null && !isValidDate(dueDate)) {
    errors.push('dueDate must be a valid date.');
  }
  if (errors.length) return fail(next, errors);
  next();
}

function validateTaskUpdate(req, res, next) {
  const { title, status, priority, dueDate } = req.body;
  const errors = [];
  if (title !== undefined && !isNonEmptyString(title)) errors.push('title must be a non-empty string.');
  if (status !== undefined && !isOneOf(status, TASK_STATUSES)) {
    errors.push(`status must be one of: ${TASK_STATUSES.join(', ')}.`);
  }
  if (priority !== undefined && !isOneOf(priority, TASK_PRIORITIES)) {
    errors.push(`priority must be one of: ${TASK_PRIORITIES.join(', ')}.`);
  }
  if (dueDate !== undefined && dueDate !== null && !isValidDate(dueDate)) {
    errors.push('dueDate must be a valid date.');
  }
  if (errors.length) return fail(next, errors);
  next();
}

function validateTaskStatus(req, res, next) {
  const { status } = req.body;
  if (!isOneOf(status, TASK_STATUSES)) {
    return fail(next, [`status is required and must be one of: ${TASK_STATUSES.join(', ')}.`]);
  }
  next();
}

function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];
  if (!isNonEmptyString(name)) errors.push('name is required.');
  if (!isValidEmail(email)) errors.push('a valid email is required.');
  if (!isNonEmptyString(password) || password.length < 6) {
    errors.push('password is required and must be at least 6 characters.');
  }
  if (errors.length) return fail(next, errors);
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];
  if (!isValidEmail(email)) errors.push('a valid email is required.');
  if (!isNonEmptyString(password)) errors.push('password is required.');
  if (errors.length) return fail(next, errors);
  next();
}

module.exports = {
  validateUserUpdate,
  validateProjectCreate,
  validateProjectUpdate,
  validateTaskCreate,
  validateTaskUpdate,
  validateTaskStatus,
  validateRegister,
  validateLogin,
};