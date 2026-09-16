class GameEvents {
  constructor() {
    this.events = new Map();

    console.log(
      '🎮 BaziGardaan Game Events initialized'
    );
  }

  on(eventName, handler) {
    if (!eventName) {
      throw new Error(
        'Event name is required.'
      );
    }

    if (typeof handler !== 'function') {
      throw new Error(
        'Event handler must be a function.'
      );
    }

    if (!this.events.has(eventName)) {
      this.events.set(
        eventName,
        new Set()
      );
    }

    this.events
      .get(eventName)
      .add(handler);

    return () =>
      this.off(
        eventName,
        handler
      );
  }

  off(eventName, handler) {
    const handlers =
      this.events.get(eventName);

    if (!handlers) {
      return false;
    }

    const removed =
      handlers.delete(handler);

    if (handlers.size === 0) {
      this.events.delete(eventName);
    }

    return removed;
  }

  async emit(
    eventName,
    context = {},
    data = {}
  ) {
    const handlers =
      this.events.get(eventName);

    if (
      !handlers ||
      handlers.size === 0
    ) {
      return [];
    }

    const results = [];

    for (const handler of handlers) {
      try {
        const result =
          await handler(
            context,
            data
          );

        results.push(result);
      } catch (error) {
        console.error(
          `❌ Game event error "${eventName}":`,
          error
        );
      }
    }

    return results;
  }

  once(
    eventName,
    handler
  ) {
    const wrapper =
      async (...args) => {
        this.off(
          eventName,
          wrapper
        );

        return handler(...args);
      };

    return this.on(
      eventName,
      wrapper
    );
  }

  has(eventName) {
    const handlers =
      this.events.get(eventName);

    return Boolean(
      handlers &&
      handlers.size > 0
    );
  }

  count(eventName) {
    const handlers =
      this.events.get(eventName);

    return handlers
      ? handlers.size
      : 0;
  }

  list() {
    return Array.from(
      this.events.keys()
    );
  }

  clear(eventName) {
    if (eventName) {
      return this.events.delete(
        eventName
      );
    }

    this.events.clear();

    return true;
  }

  clearAll() {
    this.events.clear();
  }
}

const gameEvents =
  new GameEvents();

export default gameEvents;
