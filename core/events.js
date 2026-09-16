class EventManager {
  constructor() {
    this.events = new Map();

    console.log('📡 BaziGardaan Event Manager initialized');
  }

  on(eventName, handler) {
    if (!eventName || typeof handler !== 'function') {
      throw new Error('Event name and handler are required.');
    }

    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }

    this.events.get(eventName).add(handler);

    return () => this.off(eventName, handler);
  }

  off(eventName, handler) {
    const handlers = this.events.get(eventName);

    if (!handlers) {
      return false;
    }

    const removed = handlers.delete(handler);

    if (handlers.size === 0) {
      this.events.delete(eventName);
    }

    return removed;
  }

  once(eventName, handler) {
    const wrapper = async (...args) => {
      this.off(eventName, wrapper);
      return handler(...args);
    };

    return this.on(eventName, wrapper);
  }

  async emit(eventName, ...args) {
    const handlers = this.events.get(eventName);

    if (!handlers || handlers.size === 0) {
      return [];
    }

    const results = [];

    for (const handler of handlers) {
      try {
        results.push(await handler(...args));
      } catch (error) {
        console.error(
          `❌ Event error "${eventName}":`,
          error
        );
      }
    }

    return results;
  }

  has(eventName) {
    const handlers = this.events.get(eventName);

    return Boolean(handlers && handlers.size > 0);
  }

  listenerCount(eventName) {
    const handlers = this.events.get(eventName);

    return handlers ? handlers.size : 0;
  }

  clear(eventName) {
    if (eventName) {
      return this.events.delete(eventName);
    }

    this.events.clear();
    return true;
  }

  list() {
    return Array.from(this.events.keys());
  }
}

const eventManager = new EventManager();

export default eventManager;
