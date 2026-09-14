// Express async route handlers mein agar error aaye (Promise reject ho),
// to normally wo automatically errorHandler tak nahi pahunchta. Ye wrapper
// har async controller ke error ko pakad ke next(err) tak bhej deta hai.
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;