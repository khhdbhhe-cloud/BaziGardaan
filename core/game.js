class BaseGame {
  constructor(options = {}) {
    this.name = options.name || 'unknown';
    this.displayName = options.displayName || this.name;

    this.minPlayers = Number.isInteger(options.minPlayers)
      ? options.minPlayers
      : 1;

    this.maxPlayers = Number.isInteger(options.maxPlayers)
      ? options.maxPlayers
      : 100;

    this.settings = {
      ...options.settings
    };

    this.createdAt = Date.now();
  }

  async onCreate(context) {
    return context;
  }

  async onPlayerJoin(context, player) {
    return {
      success: true,
      player
    };
  }

  async onPlayerLeave(context, player) {
    return {
      success: true,
      player
    };
  }

  async onStart(context) {
    return context;
  }

  async onStop(context) {
    return context;
  }

  async onMessage(context) {
    return false;
  }

  async onAction(context, action) {
    return {
      handled: false,
      action
    };
  }

  async onTurn(context) {
    return context;
  }

  async onTimeout(context) {
    return context;
  }

  async onFinish(context, result = {}) {
    return result;
  }

  canStart(playerCount) {
    return (
      playerCount >= this.minPlayers &&
      playerCount <= this.maxPlayers
    );
  }

  getInfo() {
    return {
      name: this.name,
      displayName: this.displayName,
      minPlayers: this.minPlayers,
      maxPlayers: this.maxPlayers,
      settings: {
        ...this.settings
      }
    };
  }

  validate() {
    if (!this.name) {
      throw new Error('Game name is required.');
    }

    if (this.minPlayers < 1) {
      throw new Error('Minimum players must be at least 1.');
    }

    if (this.maxPlayers < this.minPlayers) {
      throw new Error(
        'Maximum players cannot be less than minimum players.'
      );
    }

    return true;
  }
}

export default BaseGame;
