class GameTurn {
  constructor() {
    this.turns = new Map();

    console.log(
      '🔄 BaziGardaan Game Turn initialized'
    );
  }

  create(chatId, players = []) {
    if (!chatId) {
      throw new Error(
        'Chat ID is required.'
      );
    }

    const id = String(chatId);

    if (this.turns.has(id)) {
      return this.turns.get(id);
    }

    const playerIds = this.normalizePlayers(
      players
    );

    const turn = {
      chatId: id,

      players: playerIds,

      currentIndex: 0,

      round: 1,

      turnNumber: 1,

      startedAt: Date.now(),

      updatedAt: Date.now()
    };

    this.turns.set(id, turn);

    console.log(
      `🔄 Turn created | Chat: ${id}`
    );

    return turn;
  }

  get(chatId) {
    return (
      this.turns.get(
        String(chatId)
      ) || null
    );
  }

  has(chatId) {
    return this.turns.has(
      String(chatId)
    );
  }

  normalizePlayers(players) {
    if (!Array.isArray(players)) {
      return [];
    }

    return players
      .map((player) => {
        if (
          player &&
          typeof player === 'object'
        ) {
          return player.id;
        }

        return player;
      })
      .filter(
        (id) =>
          id !== null &&
          id !== undefined
      );
  }

  setPlayers(chatId, players = []) {
    const turn = this.get(chatId);

    if (!turn) {
      throw new Error(
        'Turn not found.'
      );
    }

    turn.players =
      this.normalizePlayers(
        players
      );

    if (
      turn.currentIndex >=
      turn.players.length
    ) {
      turn.currentIndex = 0;
    }

    turn.updatedAt = Date.now();

    return turn;
  }

  getPlayers(chatId) {
    const turn = this.get(chatId);

    if (!turn) {
      return [];
    }

    return [...turn.players];
  }

  getCurrentPlayerId(chatId) {
    const turn = this.get(chatId);

    if (
      !turn ||
      turn.players.length === 0
    ) {
      return null;
    }

    return (
      turn.players[
        turn.currentIndex
      ] ?? null
    );
  }

  isCurrentPlayer(
    chatId,
    userId
  ) {
    const current =
      this.getCurrentPlayerId(
        chatId
      );

    if (
      current === null ||
      userId === null ||
      userId === undefined
    ) {
      return false;
    }

    return (
      String(current) ===
      String(userId)
    );
  }

  next(chatId) {
    const turn = this.get(chatId);

    if (!turn) {
      throw new Error(
        'Turn not found.'
      );
    }

    if (turn.players.length === 0) {
      return turn;
    }

    turn.currentIndex += 1;

    if (
      turn.currentIndex >=
      turn.players.length
    ) {
      turn.currentIndex = 0;
      turn.round += 1;
    }

    turn.turnNumber += 1;
    turn.startedAt = Date.now();
    turn.updatedAt = Date.now();

    return turn;
  }

  previous(chatId) {
    const turn = this.get(chatId);

    if (!turn) {
      throw new Error(
        'Turn not found.'
      );
    }

    if (turn.players.length === 0) {
      return turn;
    }

    turn.currentIndex -= 1;

    if (turn.currentIndex < 0) {
      turn.currentIndex =
        turn.players.length - 1;

      turn.round = Math.max(
        1,
        turn.round - 1
      );
    }

    turn.turnNumber = Math.max(
      1,
      turn.turnNumber - 1
    );

    turn.startedAt = Date.now();
    turn.updatedAt = Date.now();

    return turn;
  }

  setCurrentPlayer(
    chatId,
    userId
  ) {
    const turn = this.get(chatId);

    if (!turn) {
      throw new Error(
        'Turn not found.'
      );
    }

    const index =
      turn.players.findIndex(
        (id) =>
          String(id) ===
          String(userId)
      );

    if (index === -1) {
      return false;
    }

    turn.currentIndex = index;

    turn.startedAt = Date.now();
    turn.updatedAt = Date.now();

    return true;
  }

  getRound(chatId) {
    const turn = this.get(chatId);

    return turn
      ? turn.round
      : 0;
  }

  getTurnNumber(chatId) {
    const turn = this.get(chatId);

    return turn
      ? turn.turnNumber
      : 0;
  }

  getTurnAge(chatId) {
    const turn = this.get(chatId);

    if (!turn) {
      return 0;
    }

    return Math.max(
      0,
      Date.now() - turn.startedAt
    );
  }

  reset(chatId) {
    const turn = this.get(chatId);

    if (!turn) {
      return false;
    }

    turn.currentIndex = 0;
    turn.round = 1;
    turn.turnNumber = 1;
    turn.startedAt = Date.now();
    turn.updatedAt = Date.now();

    return turn;
  }

  delete(chatId) {
    return this.turns.delete(
      String(chatId)
    );
  }

  clear() {
    this.turns.clear();
  }

  getAll() {
    return Array.from(
      this.turns.values()
    );
  }

  count() {
    return this.turns.size;
  }
}

const gameTurn =
  new GameTurn();

export default gameTurn;
