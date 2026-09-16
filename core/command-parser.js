class CommandParser {
  constructor() {
    console.log(
      '🔎 BaziGardaan Command Parser initialized'
    );
  }

  parse(text) {
    if (
      typeof text !== 'string' ||
      !text.trim()
    ) {
      return null;
    }

    const normalized = text.trim();
    const parts = normalized.split(/\s+/);

    const firstPart = parts.shift();

    const command = firstPart
      .replace(/^\/+/, '')
      .replace(/@\w+$/, '')
      .trim()
      .toLowerCase();

    if (!command) {
      return null;
    }

    return {
      command,
      args: parts,
      text: normalized,
      rawCommand: firstPart
    };
  }

  getCommand(text) {
    const result = this.parse(text);

    return result?.command || null;
  }

  getArgs(text) {
    const result = this.parse(text);

    return result?.args || [];
  }

  hasArgs(text) {
    const args = this.getArgs(text);

    return args.length > 0;
  }

  getFirstArg(text) {
    const args = this.getArgs(text);

    return args[0] || null;
  }

  getRest(text) {
    const result = this.parse(text);

    if (!result) {
      return '';
    }

    return result.args.join(' ');
  }

  isCommand(text, command) {
    const parsedCommand =
      this.getCommand(text);

    if (!parsedCommand || !command) {
      return false;
    }

    return (
      parsedCommand ===
      String(command)
        .replace(/^\/+/, '')
        .replace(/@\w+$/, '')
        .trim()
        .toLowerCase()
    );
  }

  parseArgs(text) {
    const args = this.getArgs(text);

    return args.map((arg) => ({
      value: arg,
      number: this.toNumber(arg),
      isNumber: this.isNumber(arg),
      isId: this.isId(arg),
      isMention: this.isMention(arg)
    }));
  }

  toNumber(value) {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : null;
  }

  isNumber(value) {
    return this.toNumber(value) !== null;
  }

  isId(value) {
    if (
      value === null ||
      value === undefined
    ) {
      return false;
    }

    return /^-?\d+$/.test(
      String(value)
    );
  }

  isMention(value) {
    if (
      typeof value !== 'string'
    ) {
      return false;
    }

    return /^@[a-zA-Z0-9_]{3,}$/.test(
      value
    );
  }

  cleanMention(value) {
    if (
      typeof value !== 'string'
    ) {
      return null;
    }

    if (!this.isMention(value)) {
      return null;
    }

    return value.slice(1);
  }

  normalizeArgs(args = []) {
    if (!Array.isArray(args)) {
      return [];
    }

    return args
      .map((arg) =>
        String(arg).trim()
      )
      .filter(Boolean);
  }

  createResult(
    command,
    args = [],
    extra = {}
  ) {
    return {
      command: String(command)
        .replace(/^\/+/, '')
        .toLowerCase(),

      args: this.normalizeArgs(args),

      ...extra
    };
  }
}

const commandParser =
  new CommandParser();

export default commandParser;
