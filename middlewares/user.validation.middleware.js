import { USER } from '../models/user.js';
import { respondWithValidationErrors } from '../validators/common.js';
import { isFieldsAllowed, validateUser } from '../validators/user.validator.js';

const createUserValid = (req, res, next) => {
  const { id, ...newUser } = USER;
  const { body } = req;
  const userData = Object.assign({}, newUser, body);
  const errors = validateUser(userData);

  if (errors.length) {
    return respondWithValidationErrors({ res, next, errors });
  }

  next();
};

const updateUserValid = (req, res, next) => {
  const { id, ...userModel } = USER;
  const { body: userData } = req;
  const isProvidedFieldsAllowed = isFieldsAllowed({
    userData,
    userModel,
  });

  if (!isProvidedFieldsAllowed) {
    return respondWithValidationErrors({ res, next });
  }

  const errors = validateUser(userData);

  if (errors.length) {
    return respondWithValidationErrors({ res, next, errors });
  }

  next();
};

export { createUserValid, updateUserValid };
