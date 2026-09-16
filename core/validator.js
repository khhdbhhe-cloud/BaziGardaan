class Validator {
  required(value, fieldName = 'Value') {
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ''
    ) {
      throw new Error(`${fieldName} is required.`);
    }

    return value;
  }

  string(value, fieldName = 'Value') {
    if (typeof value !== 'string') {
      throw new Error(`${fieldName} must be a string.`);
    }

    return value;
  }

  number(value, fieldName = 'Value') {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      throw new Error(`${fieldName} must be a valid number.`);
    }

    return number;
  }

  integer(value, fieldName = 'Value') {
    const number = Number(value);

    if (!Number.isInteger(number)) {
      throw new Error(`${fieldName} must be an integer.`);
    }

    return number;
  }

  positiveNumber(value, fieldName = 'Value') {
    const number = this.number(value, fieldName);

    if (number <= 0) {
      throw new Error(
        `${fieldName} must be greater than zero.`
      );
    }

    return number;
  }

  positiveInteger(value, fieldName = 'Value') {
    const number = this.integer(value, fieldName);

    if (number <= 0) {
      throw new Error(
        `${fieldName} must be greater than zero.`
      );
    }

    return number;
  }

  boolean(value, fieldName = 'Value') {
    if (typeof value !== 'boolean') {
      throw new Error(`${fieldName} must be a boolean.`);
    }

    return value;
  }

  array(value, fieldName = 'Value') {
    if (!Array.isArray(value)) {
      throw new Error(`${fieldName} must be an array.`);
    }

    return value;
  }

  object(value, fieldName = 'Value') {
    if (
      value === null ||
      typeof value !== 'object' ||
      Array.isArray(value)
    ) {
      throw new Error(`${fieldName} must be an object.`);
    }

    return value;
  }

  oneOf(value, allowed = [], fieldName = 'Value') {
    if (!Array.isArray(allowed)) {
      throw new Error('Allowed values must be an array.');
    }

    if (!allowed.includes(value)) {
      throw new Error(
        `${fieldName} has an invalid value.`
      );
    }

    return value;
  }

  range(
    value,
    min,
    max,
    fieldName = 'Value'
  ) {
    const number = this.number(value, fieldName);

    if (number < min || number > max) {
      throw new Error(
        `${fieldName} must be between ${min} and ${max}.`
      );
    }

    return number;
  }

  user(user) {
    this.object(user, 'User');

    this.required(user.id, 'User ID');

    return true;
  }

  chatId(chatId) {
    this.required(chatId, 'Chat ID');

    return true;
  }

  gameName(gameName) {
    this.required(gameName, 'Game name');

    return true;
  }

  players(players) {
    this.array(players, 'Players');

    for (const player of players) {
      this.user(player);
    }

    return true;
  }
}

const validator = new Validator();

export default validator;
