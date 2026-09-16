class GameRegistry {
  constructor() {
    this.games = new Map();

    console.log('📚 BaziGardaan Game Registry initialized');
  }

  register(game) {
    if (!game) {
      throw new Error('Game is required.');
    }

    if (!game.name) {
      throw new Error('Game name is required.');
    }

    if (this.games.has(game.name)) {
      throw new Error(
        `Game "${game.name}" is already registered.`
      );
    }

    if (typeof game.validate === 'function') {
      game.validate();
    }

    this.games.set(game.name, game);

    console.log(
      `🎮 Game registered in registry: ${game.name}`
    );

    return game;
  }

  unregister(name) {
    if (!name) {
      return false;
    }

    return this.games.delete(name);
  }

  get(name) {
    if (!name) {
      return null;
    }

    return this.games.get(name) || null;
  }

  has(name) {
    return this.games.has(name);
  }

  getInfo(name) {
    const game = this.get(name);

    if (!game) {
      return null;
    }

    if (typeof game.getInfo === 'function') {
      return game.getInfo();
    }

    return {
      name: game.name,
      displayName: game.displayName || game.name
    };
  }

  list() {
    return Array.from(this.games.values());
  }

  listNames() {
    return Array.from(this.games.keys());
  }

  getCount() {
    return this.games.size;
  }

  clear() {
    this.games.clear();
  }
}

const gameRegistry = new GameRegistry();

export default gameRegistry;
