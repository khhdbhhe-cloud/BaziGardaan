class MiddlewareManager {
  constructor() {
    this.middlewares = [];

    console.log(
      '🛡️ BaziGardaan Middleware Manager initialized'
    );
  }

  use(handler, options = {}) {
    if (typeof handler !== 'function') {
      throw new Error(
        'Middleware handler must be a function.'
      );
    }

    const middleware = {
      handler,
      name: options.name || handler.name || 'anonymous',
      enabled:
        options.enabled === undefined
          ? true
          : Boolean(options.enabled),
      priority: Number.isFinite(options.priority)
        ? options.priority
        : 0
    };

    this.middlewares.push(middleware);

    this.middlewares.sort(
      (a, b) => b.priority - a.priority
    );

    return middleware;
  }

  remove(handlerOrName) {
    const index = this.middlewares.findIndex(
      (middleware) =>
        middleware.handler === handlerOrName ||
        middleware.name === handlerOrName
    );

    if (index === -1) {
      return false;
    }

    this.middlewares.splice(index, 1);

    return true;
  }

  enable(handlerOrName) {
    const middleware = this.find(
      handlerOrName
    );

    if (!middleware) {
      return false;
    }

    middleware.enabled = true;

    return true;
  }

  disable(handlerOrName) {
    const middleware = this.find(
      handlerOrName
    );

    if (!middleware) {
      return false;
    }

    middleware.enabled = false;

    return true;
  }

  find(handlerOrName) {
    return (
      this.middlewares.find(
        (middleware) =>
          middleware.handler === handlerOrName ||
          middleware.name === handlerOrName
      ) || null
    );
  }

  list() {
    return this.middlewares.map(
      (middleware) => ({
        name: middleware.name,
        enabled: middleware.enabled,
        priority: middleware.priority
      })
    );
  }

  clear() {
    this.middlewares = [];
  }

  async run(ctx) {
    const active = this.middlewares.filter(
      (middleware) =>
        middleware.enabled
    );

    let index = -1;

    const next = async () => {
      index += 1;

      if (index >= active.length) {
        return;
      }

      const middleware = active[index];

      await middleware.handler(
        ctx,
        next
      );
    };

    await next();

    return true;
  }

  count() {
    return this.middlewares.length;
  }

  enabledCount() {
    return this.middlewares.filter(
      (middleware) =>
        middleware.enabled
    ).length;
  }
}

const middlewareManager =
  new MiddlewareManager();

export default middlewareManager;
