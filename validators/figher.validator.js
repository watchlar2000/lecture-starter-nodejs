import { isNonEmptyString, validateInputs } from './common.js';

function isValidValue(value) {
  return function (min, max) {
    const num = Number(value);
    return Number.isInteger(num) && num >= min && num <= max;
  };
}

function isPowerValid(value) {
  return isValidValue(value)(1, 100);
}

function isDefenseValid(value) {
  return isValidValue(value)(1, 10);
}

function isHealthValid(value) {
  return isValidValue(value)(80, 120);
}

const fighterValidationRules = {
  name: {
    validate: isNonEmptyString,
    message: 'Name is required',
  },
  power: {
    validate: isPowerValid,
    message: 'Must be a number between 1 and 100 inclusive',
  },
  defense: {
    validate: isDefenseValid,
    message: 'Must be a number between 1 and 10 inclusive',
  },
  health: {
    validate: isHealthValid,
    message: 'Must be a number between 80 and 120 inclusive',
  },
};

function validateFighter(fighterData) {
  return validateInputs({
    inputs: fighterData,
    rules: fighterValidationRules,
  });
}

function normalizeFighterData(data) {
  const numericValues = new Set(['power', 'defense', 'health']);
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      numericValues.has(key) ? Number(value) : value,
    ]),
  );
}

export { normalizeFighterData, validateFighter };
