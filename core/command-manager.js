class CommandManager {
  constructor() {
    this.commands = new Map();

    console.log('⌨️ BaziGardaan Command Manager initialized');
  }

  register(name, handler, options = {}) {
    if (!name) {
      throw new Error('Command name is required.');
    }

    if (typeof handler !== 'function') {
      throw new Error('Command handler must be a function.');
    }

    const commandName = name
      .trim()
      .toLowerCase();

    if (!commandName) {
      throw new Error('Command name cannot be empty.');
    }

    if (this.commands.has(commandName)) {
      throw new Error(
        `Command "${commandName}" is already registered.`
      );
    }

    const command = {
      name: commandName,
      handler,

      aliases: Array.isArray(options.aliases)
        ? options.aliases.map((alias) =>
            String(alias).trim().toLowerCase()
          )
        : [],

      description: options.description || '',

      permission: options.permission || null,

      privateOnly: Boolean(options.privateOnly),

      groupOnly: Boolean(options.groupOnly),

      createdAt: Date.now()
    };

    this.commands.set(commandName, command);

    for (const alias of command.aliases) {
      if (!alias || this.commands.has(alias)) {
        continue;
      }

      this.commands.set(alias, {
        ...command,
        isAlias: true,
        aliasFor: commandName
      });
    }

    console.log(
      `⌨️ Command registered: ${commandName}`
    );

    return command;
  }

  unregister(name) {
    if (!name) {
      return false;
    }

    const commandName = name
      .trim()
      .toLowerCase();

    const command = this.commands.get(commandName);

    if (!command) {
      return false;
    }

    const mainName = command.aliasFor || command.name;

    for (const [key, value] of this.commands.entries()) {
      if (
        value.name === mainName ||
        value.aliasFor === mainName
      ) {
        this.commands.delete(key);
      }
    }

    return true;
  }

  get(name) {
    if (!name) {
      return null;
    }

    const commandName = name
      .trim()
      .toLowerCase();

    return this.commands.get(commandName) || null;
  }

  has(name) {
    return Boolean(this.get(name));
  }

  getAll() {
    const unique = new Map();

    for (const command of this.commands.values()) {
      const mainName = command.aliasFor || command.name;

      if (!unique.has(mainName)) {
        unique.set(mainName, command);
      }
    }

    return Array.from(unique.values());
  }

  getNames() {
    return this.getAll().map(
      (command) => command.name
    );
  }

  getAliases(name) {
    const command = this.get(name);

    if (!command) {
      return [];
    }

    const mainName = command.aliasFor || command.name;
    const mainCommand = this.commands.get(mainName);

    if (!mainCommand) {
      return [];
    }

    return [...mainCommand.aliases];
  }

  extract(text) {
    if (!text || typeof text !== 'string') {
      return null;
    }

    const trimmed = text.trim();

    if (!trimmed) {
      return null;
    }

    const firstPart = trimmed.split(/\s+/)[0];

    const command = firstPart
      .replace(/^\/+/, '')
      .replace(/@\w+$/, '')
      .trim()
      .toLowerCase();

    return command || null;
  }

  async execute(name, ctx, ...args) {
    const command = this.get(name);

    if (!command) {
      return false;
    }

    return command.handler(ctx, ...args);
  }

  async handle(ctx) {
    const text = ctx?.message?.text;

    if (!text) {
      return false;
    }

    const commandName = this.extract(text);

    if (!commandName) {
      return false;
    }

    const command = this.get(commandName);

    if (!command) {
      return false;
    }

    try {
      await command.handler(ctx);
      return true;
    } catch (error) {
      console.error(
        `❌ Command error "${command.name}":`,
        error
      );

      throw error;
    }
  }

  count() {
    return this.getAll().length;
  }

  clear() {
    this.commands.clear();
  }
}

const commandManager = new CommandManager();

export default commandManager;
