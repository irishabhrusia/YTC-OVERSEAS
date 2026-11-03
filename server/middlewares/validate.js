// Reusable Zod validation middleware

/**
 * Validates req.body against a provided Zod schema.
 * Formats errors into { success: false, message, errors }.
 *
 * @param {import('zod').ZodSchema} schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error.issues) {
      const formattedErrors = error.issues.map((issue) => {
        const field = issue.path.length > 0 ? issue.path.join('.') : 'root';
        let message = issue.message;

        // Custom message for unrecognized keys when .strict() triggers
        if (issue.code === 'unrecognized_keys') {
          message = `Unrecognized field(s): ${issue.keys.join(', ')}`;
        }

        return {
          field,
          message,
        };
      });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || 'Validation error',
    });
  }
};

module.exports = validate;

