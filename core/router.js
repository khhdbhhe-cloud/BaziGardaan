class MessageRouter {
  constructor(engine) {
    this.engine = engine;
    this.routes = new Map();

    console.log('🧭 BaziGardaan Message Router initialized');
  }

  register(command, handler) {
    if (!command || typeof handler !== 'function') {
      throw new Error('Command and handler are required.');
    }

    this.routes.set(command.toLowerCase(), handler);

    console.log(`📌 Route registered: ${command}`);
  }

  remove(command) {
    return this.routes.delete(command.toLowerCase());
  }

  has(command) {
    return this.routes.has(command.toLowerCase());
  }

  getCommands() {
    return Array.from(this.routes.keys());
  }

  async handle(ctx) {
    if (!ctx?.message?.text) {
      return false;
    }

    const text = ctx.message.text.trim();

    if (!text) {
      return false;
    }

    const command = this.extractCommand(text);

    if (!command) {
      return false;
    }

    const handler = this.routes.get(command);

    if (!handler) {
      return false;
    }

    try {
      await handler(ctx);
      return true;
    } catch (error) {
      console.error(
        `❌ Router error for "${command}":`,
        error
      );

      throw error;
    }
  }

  extractCommand(text) {
    const firstPart = text.split(/\s+/)[0];

    return firstPart
      .replace(/^\/+/, '')
      .replace(/@\w+$/, '')
      .toLowerCase();
  }
}

export default MessageRouter;
