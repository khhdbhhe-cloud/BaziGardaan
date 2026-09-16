class GameHistory {
  constructor() {
    this.history = new Map();
    this.nextId = 1;

    console.log('📜 BaziGardaan Game History initialized');
  }

  add(result) {
    if (!result) {
      throw new Error('Game result is required.');
    }

    const id = this.nextId++;

    const record = {
      id,
      ...this.cloneResult(result),
      recordedAt: Date.now()
    };

    this.history.set(id, record);

    console.log(
      `📜 Game history added | ID: ${id}`
    );

    return record;
  }

  cloneResult(result) {
    if (
      result &&
      typeof result.toJSON === 'function'
    ) {
      return result.toJSON();
    }

    return {
      ...result,

      winners: Array.isArray(result.winners)
        ? [...result.winners]
        : [],

      players: Array.isArray(result.players)
        ? [...result.players]
        : [],

      scores: result.scores
        ? { ...result.scores }
        : {},

      data: result.data
        ? { ...result.data }
        : {}
    };
  }

  get(id) {
    return this.history.get(
      Number(id)
    ) || null;
  }

  getByChat(chatId) {
    if (
      chatId === null ||
      chatId === undefined
    ) {
      return [];
    }

    const id = String(chatId);

    return Array.from(
      this.history.values()
    ).filter(
      (record) =>
        String(record.chatId) === id
    );
  }

  getByGame(gameName) {
    if (!gameName) {
      return [];
    }

    return Array.from(
      this.history.values()
    ).filter(
      (record) =>
        record.gameName === gameName
    );
  }

  getByPlayer(userId) {
    if (
      userId === null ||
      userId === undefined
    ) {
      return [];
    }

    const id = String(userId);

    return Array.from(
      this.history.values()
    ).filter((record) => {
      const players = Array.isArray(
        record.players
      )
        ? record.players
        : [];

      const winners = Array.isArray(
        record.winners
      )
        ? record.winners
        : [];

      return (
        players.some(
          (player) =>
            String(
              typeof player === 'object'
                ? player.id
                : player
            ) === id
        ) ||
        winners.some(
          (winner) =>
            String(
              typeof winner === 'object'
                ? winner.id
                : winner
            ) === id
        )
      );
    });
  }

  getRecent(limit = 10) {
    const amount = Math.max(
      1,
      Number(limit) || 10
    );

    return Array.from(
      this.history.values()
    )
      .sort(
        (a, b) =>
          b.recordedAt - a.recordedAt
      )
      .slice(0, amount);
  }

  getLatestForChat(
    chatId,
    limit = 10
  ) {
    const amount = Math.max(
      1,
      Number(limit) || 10
    );

    return this.getByChat(chatId)
      .sort(
        (a, b) =>
          b.recordedAt - a.recordedAt
      )
      .slice(0, amount);
  }

  remove(id) {
    return this.history.delete(
      Number(id)
    );
  }

  clearChat(chatId) {
    const records = this.getByChat(
      chatId
    );

    for (const record of records) {
      this.history.delete(record.id);
    }

    return records.length;
  }

  clear() {
    this.history.clear();
  }

  count() {
    return this.history.size;
  }

  getAll() {
    return Array.from(
      this.history.values()
    );
  }
}

const gameHistory = new GameHistory();

export default gameHistory;
