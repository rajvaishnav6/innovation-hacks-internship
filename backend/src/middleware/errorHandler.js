function errorHandler(err, req, res, next) {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong on the server.';

  // Postgres error codes — https://www.postgresql.org/docs/current/errcodes-summary.html
  if (err.code === '23505') { // unique_violation (e.g. duplicate email)
    statusCode = 409;
    message = 'A record with this value already exists.';
  }
  if (err.code === '23503') { // foreign_key_violation (e.g. projectId doesn't exist)
    statusCode = 400;
    message = 'This request references a record that does not exist.';
  }
  if (err.code === '23514') { // check_violation (e.g. invalid status/priority value)
    statusCode = 400;
    message = 'One of the values provided is not allowed.';
  }
  if (err.code === '22P02') { // invalid_text_representation (e.g. bad id format)
    statusCode = 404;
    message = 'Resource not found.';
  }

  const body = { error: message };
  if (err.details) body.details = err.details;
  res.status(statusCode).json(body);
}

module.exports = errorHandler;