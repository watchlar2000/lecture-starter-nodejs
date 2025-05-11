import {
  isNonEmptyString,
  isPasswordValid,
  isPhoneValid,
  isValidEmail,
  validateInputs,
} from './common.js';

const userValidationRules = {
  firstName: {
    validate: isNonEmptyString,
    message: 'First name is required',
  },
  lastName: {
    validate: isNonEmptyString,
    message: 'Last name is required',
  },
  email: {
    validate: isValidEmail,
    message: 'Only @gmail.com domains are allowed',
  },
  phone: {
    validate: isPhoneValid,
    message: '+380xxxxxxxxx format is required',
  },
  password: {
    validate: isPasswordValid,
    message: 'Password must be min 4 characters long',
  },
};

function isFieldsAllowed({ userData, userModel }) {
  const allowedFields = new Set(Object.keys(userModel));
  const providedFields = Object.keys(userData);
  return providedFields.every((field) => allowedFields.has(field));
}

function validateUser(userData) {
  return validateInputs({
    inputs: userData,
    rules: userValidationRules,
  });
}

export { isFieldsAllowed, validateUser };
