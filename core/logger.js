class Logger {
  constructor() {
    this.enabled = true;

    console.log('📝 BaziGardaan Logger initialized');
  }

  setEnabled(value) {
    this.enabled = Boolean(value);
  }

  info(message, ...args) {
    if (!this.enabled) {
      return;
    }

    console.log(`ℹ️ ${message}`, ...args);
  }

  success(message, ...args) {
    if (!this.enabled) {
      return;
    }

    console.log(`✅ ${message}`, ...args);
  }

  warn(message, ...args) {
    if (!this.enabled) {
      return;
    }

    console.warn(`⚠️ ${message}`, ...args);
  }

  error(message, ...args) {
    if (!this.enabled) {
      return;
    }

    console.error(`❌ ${message}`, ...args);
  }

  debug(message, ...args) {
    if (!this.enabled) {
      return;
    }

    console.debug(`🐛 ${message}`, ...args);
  }

  game(message, ...args) {
    if (!this.enabled) {
      return;
    }

    console.log(`🎮 ${message}`, ...args);
  }

  player(message, ...args) {
    if (!this.enabled) {
      return;
    }

    console.log(`👤 ${message}`, ...args);
  }

  session(message, ...args) {
    if (!this.enabled) {
      return;
    }

    console.log(`🗂️ ${message}`, ...args);
  }
}

const logger = new Logger();

export default logger;
