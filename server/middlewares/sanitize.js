/**
 * Sanitizes input objects by stripping keys starting with '$' or containing '.'
 * to prevent MongoDB operator injection.
 */
function sanitize(value) {
  if (!value || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }
  const sanitized = {};
  for (const key of Object.keys(value)) {
    if (!key.startsWith('$') && !key.includes('.')) {
      sanitized[key] = sanitize(value[key]);
    }
  }
  return sanitized;
}

const mongoSanitize = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitize(req.params);
  }
  // Sanitize query params to prevent NoSQL injection and ReDoS via regex payloads
  if (req.query && typeof req.query === 'object') {
    req.query = sanitize(req.query);
    // Limit string query values to 200 chars to prevent ReDoS via $regex
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'string' && req.query[key].length > 200) {
        req.query[key] = req.query[key].slice(0, 200);
      }
    }
  }
  next();
};

module.exports = mongoSanitize;

