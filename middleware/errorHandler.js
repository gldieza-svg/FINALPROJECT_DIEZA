// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ error: 'Validation error', messages });
  }

  // Default 500
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred.',
  });
};

module.exports = errorHandler;
