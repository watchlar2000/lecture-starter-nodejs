import { FIGHTER } from '../models/fighter.js';
import {
  isFieldsAllowed as isFighterFieldsAllowed,
  respondWithValidationErrors,
} from '../validators/common.js';
import {
  normalizeFighterData,
  validateFighter,
} from '../validators/figher.validator.js';

const createFighterValid = (req, res, next) => {
  const { id, ...newFighter } = FIGHTER;
  const { body } = req;
  const fighterData = Object.assign({}, newFighter, body);
  const errors = validateFighter(fighterData);

  if (errors.length) {
    return respondWithValidationErrors({ res, next, errors });
  }

  req.body = normalizeFighterData(fighterData);
  next();
};

const updateFighterValid = (req, res, next) => {
  const { id, ...fighterModel } = FIGHTER;
  const { body: fighterData } = req;
  const isProvidedFieldsAllowed = isFighterFieldsAllowed({
    inputFields: fighterData,
    model: fighterModel,
  });

  if (!isProvidedFieldsAllowed) {
    return respondWithValidationErrors({ res, next });
  }

  const errors = validateFighter(fighterData);

  if (errors.length) {
    return respondWithValidationErrors({ res, next, errors });
  }

  req.body = normalizeFighterData(fighterData);
  next();
};

export { createFighterValid, updateFighterValid };
