class GameState {
  constructor() {
    this.states = new Map();

    console.log('🎯 BaziGardaan Game State initialized');
  }

  create(chatId, gameName, initialData = {}) {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    if (!gameName) {
      throw new Error('Game name is required.');
    }

    if (this.states.has(chatId)) {
      throw new Error('Game state already exists for this chat.');
    }

    const state = {
      chatId,
      gameName,

      status: 'waiting',

      currentPlayerId: null,
      round: 0,
      turn: 0,

      data: {
        ...initialData
      },

      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.states.set(chatId, state);

    console.log(
      `🎯 Game state created | Chat: ${chatId} | Game: ${gameName}`
    );

    return state;
  }

  get(chatId) {
    return this.states.get(chatId) || null;
  }

  has(chatId) {
    return this.states.has(chatId);
  }

  update(chatId, data = {}) {
    const state = this.get(chatId);

    if (!state) {
      throw new Error('Game state not found.');
    }

    Object.assign(state, data);

    state.updatedAt = Date.now();

    return state;
  }

  setStatus(chatId, status) {
    const state = this.get(chatId);

    if (!state) {
      throw new Error('Game state not found.');
    }

    state.status = status;
    state.updatedAt = Date.now();

    return state;
  }

  setCurrentPlayer(chatId, playerId) {
    const state = this.get(chatId);

    if (!state) {
      throw new Error('Game state not found.');
    }

    state.currentPlayerId = playerId;
    state.updatedAt = Date.now();

    return state;
  }

  nextTurn(chatId) {
    const state = this.get(chatId);

    if (!state) {
      throw new Error('Game state not found.');
    }

    state.turn += 1;
    state.updatedAt = Date.now();

    return state;
  }

  nextRound(chatId) {
    const state = this.get(chatId);

    if (!state) {
      throw new Error('Game state not found.');
    }

    state.round += 1;
    state.turn = 0;
    state.updatedAt = Date.now();

    return state;
  }

  setData(chatId, key, value) {
    const state = this.get(chatId);

    if (!state) {
      throw new Error('Game state not found.');
    }

    state.data[key] = value;
    state.updatedAt = Date.now();

    return value;
  }

  getData(chatId, key) {
    const state = this.get(chatId);

    if (!state) {
      return undefined;
    }

    return state.data[key];
  }

  getAllData(chatId) {
    const state = this.get(chatId);

    if (!state) {
      return null;
    }

    return {
      ...state.data
    };
  }

  deleteData(chatId, key) {
    const state = this.get(chatId);

    if (!state) {
      return false;
    }

    const existed = Object.prototype.hasOwnProperty.call(
      state.data,
      key
    );

    if (existed) {
      delete state.data[key];
      state.updatedAt = Date.now();
    }

    return existed;
  }

  delete(chatId) {
    return this.states.delete(chatId);
  }

  clear(chatId) {
    const state = this.get(chatId);

    if (!state) {
      return false;
    }

    state.status = 'finished';
    state.updatedAt = Date.now();

    this.states.delete(chatId);

    console.log(
      `🗑️ Game state cleared | Chat: ${chatId}`
    );

    return true;
  }

  getAll() {
    return Array.from(this.states.values());
  }

  count() {
    return this.states.size;
  }
}

const gameState = new GameState();

export default gameState;
