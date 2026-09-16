class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxStoredErrors = 100;

    console.log(
      '🚨 BaziGardaan Error Handler initialized'
    );
  }

  handle(error, context = {}) {
    const normalizedError =
      this.normalize(error);

    const record = {
      ...normalizedError,
      context: this.safeContext(context),
      timestamp: Date.now()
    };

    this.errors.push(record);

    if (
      this.errors.length >
      this.maxStoredErrors
    ) {
      this.errors.shift();
    }

    console.error(
      `❌ ${record.name}: ${record.message}`
    );

    return record;
  }

  normalize(error) {
    if (error instanceof Error) {
      return {
        name: error.name || 'Error',
        message:
          error.message || 'Unknown error',
        stack: error.stack || null
      };
    }

    if (
      error &&
      typeof error === 'object'
    ) {
      return {
        name: error.name || 'Error',
        message:
          error.message ||
          'Unknown error',
        stack: error.stack || null
      };
    }

    return {
      name: 'Error',
      message: String(
        error ?? 'Unknown error'
      ),
      stack: null
    };
  }

  safeContext(context) {
    if (
      !context ||
      typeof context !== 'object'
    ) {
      return {};
    }

    return {
      chatId:
        context.chatId ??
        context.ctx?.chat?.id ??
        null,

      userId:
        context.userId ??
        context.ctx?.from?.id ??
        null,

      gameName:
        context.gameName ??
        context.game?.name ??
        context.session?.gameName ??
        null,

      command:
        context.command ?? null,

      action:
        context.action ?? null
    };
  }

  getLast(limit = 10) {
    const amount = Math.max(
      1,
      Number(limit) || 10
    );

    return this.errors
      .slice(-amount)
      .reverse();
  }

  getAll() {
    return [...this.errors];
  }

  count() {
    return this.errors.length;
  }

  clear() {
    this.errors = [];
  }

  setMaxStoredErrors(limit) {
    const amount = Number(limit);

    if (
      !Number.isInteger(amount) ||
      amount < 1
    ) {
      throw new Error(
        'Error limit must be a positive integer.'
      );
    }

    this.maxStoredErrors = amount;

    while (
      this.errors.length >
      this.maxStoredErrors
    ) {
      this.errors.shift();
    }

    return this.maxStoredErrors;
  }

  async execute(
    handler,
    context = {}
  ) {
    if (typeof handler !== 'function') {
      throw new Error(
        'Handler must be a function.'
      );
    }

    try {
      return await handler();
    } catch (error) {
      return this.handle(
        error,
        context
      );
    }
  }
}

const errorHandler =
  new ErrorHandler();

export default errorHandler;
