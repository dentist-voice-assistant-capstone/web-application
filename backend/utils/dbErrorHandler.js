const AppError = require('./../utils/appError');

exports.handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

exports.handleDuplicateFieldsDB = err => {
  const value = JSON.stringify(err.keyValue);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

exports.handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
