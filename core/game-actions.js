class GameActions {
  constructor() {
    this.actions = new Map();

    console.log(
      '🎯 BaziGardaan Game Actions initialized'
    );
  }

  register(name, handler, options = {}) {
    if (!name) {
      throw new Error(
        'Action name is required.'
      );
    }

    if (typeof handler !== 'function') {
      throw new Error(
        'Action handler must be a function.'
      );
    }

    const actionName = String(name)
      .trim()
      .toLowerCase();

    if (!actionName) {
      throw new Error(
        'Action name cannot be empty.'
      );
    }

    if (this.actions.has(actionName)) {
      throw new Error(
        `Action "${actionName}" is already registered.`
      );
    }

    const action = {
      name: actionName,
      handler,

      description:
        options.description || '',

      permission:
        options.permission || null,

      enabled:
        options.enabled === undefined
          ? true
          : Boolean(options.enabled),

      createdAt: Date.now()
    };

    this.actions.set(
      actionName,
      action
    );

    console.log(
      `🎯 Game action registered: ${actionName}`
    );

    return action;
  }

  unregister(name) {
    if (!name) {
      return false;
    }

    return this.actions.delete(
      String(name)
        .trim()
        .toLowerCase()
    );
  }

  get(name) {
    if (!name) {
      return null;
    }

    return (
      this.actions.get(
        String(name)
          .trim()
          .toLowerCase()
      ) || null
    );
  }

  has(name) {
    return Boolean(
      this.get(name)
    );
  }

  enable(name) {
    const action =
      this.get(name);

    if (!action) {
      return false;
    }

    action.enabled = true;

    return true;
  }

  disable(name) {
    const action =
      this.get(name);

    if (!action) {
      return false;
    }

    action.enabled = false;

    return true;
  }

  isEnabled(name) {
    const action =
      this.get(name);

    return Boolean(
      action &&
      action.enabled
    );
  }

  async execute(
    name,
    context = {},
    payload = {}
  ) {
    const action =
      this.get(name);

    if (!action) {
      return {
        handled: false,
        error: 'Action not found.'
      };
    }

    if (!action.enabled) {
      return {
        handled: false,
        error: 'Action is disabled.'
      };
    }

    try {
      const result =
        await action.handler(
          context,
          payload
        );

      return {
        handled: true,
        success: true,
        action: action.name,
        result
      };
    } catch (error) {
      console.error(
        `❌ Game action error "${action.name}":`,
        error
      );

      return {
        handled: true,
        success: false,
        action: action.name,
        error
      };
    }
  }

  getAll() {
    return Array.from(
      this.actions.values()
    );
  }

  getEnabled() {
    return this.getAll().filter(
      (action) =>
        action.enabled
    );
  }

  getDisabled() {
    return this.getAll().filter(
      (action) =>
        !action.enabled
    );
  }

  getNames() {
    return this.getAll().map(
      (action) =>
        action.name
    );
  }

  count() {
    return this.actions.size;
  }

  clear() {
    this.actions.clear();
  }
}

const gameActions =
  new GameActions();

export default gameActions;
