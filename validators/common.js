import { writeToResponseLocals } from '../utils/writeToResponseLocals.js';

function isNonEmptyString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@gmail\.com$/;
  return isNonEmptyString(email) && emailRegex.test(email);
}

function isPhoneValid(phone) {
  const phoneRegex = /^\+380\d{9}$/;
  return isNonEmptyString(phone) && phoneRegex.test(phone);
}

function isPasswordValid(password) {
  return isNonEmptyString(password) && password.length >= 4;
}

function validateField({ value, fieldName, rules }) {
  if (!rules[fieldName]) null;

  if (!value) {
    return {
      field: fieldName,
      message: 'Field is required',
    };
  }

  const { validate, message } = rules[fieldName];
  const isValid = validate(value);

  if (!isValid) {
    return {
      field: fieldName,
      message,
    };
  }

  return null;
}

function validateInputs({ inputs, rules }) {
  return Object.entries(inputs)
    .map(([field, value]) =>
      validateField({
        fieldName: field,
        value,
        rules,
      }),
    )
    .filter(Boolean);
}

function respondWithValidationErrors({ res, next, errors = [] }) {
  const { setError } = writeToResponseLocals(res);
  setError({
    status: 400,
    message: errors.length ? JSON.stringify(errors) : 'Validation failed',
  });
  return next('route');
}

export {
  isNonEmptyString,
  isPasswordValid,
  isPhoneValid,
  isValidEmail,
  respondWithValidationErrors,
  validateInputs,
};
