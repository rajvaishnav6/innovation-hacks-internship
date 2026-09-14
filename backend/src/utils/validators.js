function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value) {
  return !Number.isNaN(Date.parse(value));
}

function isOneOf(value, allowed) {
  return allowed.includes(value);
}

module.exports = { isNonEmptyString, isValidEmail, isValidDate, isOneOf };
