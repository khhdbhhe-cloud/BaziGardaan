class GameScore {
  constructor() {
    this.scores = new Map();

    console.log(
      '🏆 BaziGardaan Game Score initialized'
    );
  }

  create(chatId, players = []) {
    const id = String(chatId);

    if (this.scores.has(id)) {
      return this.scores.get(id);
    }

    const scoreData = {
      chatId: id,
      scores: new Map(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    for (const player of players) {
      const playerId =
        typeof player === 'object'
          ? player?.id
          : player;

      if (
        playerId !== null &&
        playerId !== undefined
      ) {
        scoreData.scores.set(
          String(playerId),
          0
        );
      }
    }

    this.scores.set(
      id,
      scoreData
    );

    return scoreData;
  }

  get(chatId) {
    return (
      this.scores.get(
        String(chatId)
      ) || null
    );
  }

  has(chatId) {
    return this.scores.has(
      String(chatId)
    );
  }

  ensurePlayer(
    chatId,
    playerId
  ) {
    const data =
      this.get(chatId);

    if (!data) {
      throw new Error(
        'Score board not found.'
      );
    }

    const id = String(playerId);

    if (!data.scores.has(id)) {
      data.scores.set(id, 0);
      data.updatedAt = Date.now();
    }

    return data.scores.get(id);
  }

  set(
    chatId,
    playerId,
    score
  ) {
    const data =
      this.get(chatId);

    if (!data) {
      throw new Error(
        'Score board not found.'
      );
    }

    const amount = Number(score);

    if (!Number.isFinite(amount)) {
      throw new Error(
        'Score must be a valid number.'
      );
    }

    const id = String(playerId);

    data.scores.set(
      id,
      amount
    );

    data.updatedAt = Date.now();

    return amount;
  }

  add(
    chatId,
    playerId,
    points
  ) {
    const current =
      this.getScore(
        chatId,
        playerId
      );

    const amount = Number(points);

    if (!Number.isFinite(amount)) {
      throw new Error(
        'Points must be a valid number.'
      );
    }

    return this.set(
      chatId,
      playerId,
      current + amount
    );
  }

  subtract(
    chatId,
    playerId,
    points
  ) {
    const amount = Number(points);

    if (!Number.isFinite(amount)) {
      throw new Error(
        'Points must be a valid number.'
      );
    }

    return this.add(
      chatId,
      playerId,
      -amount
    );
  }

  getScore(
    chatId,
    playerId
  ) {
    const data =
      this.get(chatId);

    if (!data) {
      return 0;
    }

    return (
      data.scores.get(
        String(playerId)
      ) ?? 0
    );
  }

  getScores(chatId) {
    const data =
      this.get(chatId);

    if (!data) {
      return {};
    }

    return Object.fromEntries(
      data.scores
    );
  }

  getLeaderboard(
    chatId
  ) {
    const data =
      this.get(chatId);

    if (!data) {
      return [];
    }

    return Array.from(
      data.scores.entries()
    )
      .map(
        ([playerId, score]) => ({
          playerId,
          score
        })
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );
  }

  getWinner(chatId) {
    const leaderboard =
      this.getLeaderboard(
        chatId
      );

    if (
      leaderboard.length === 0
    ) {
      return null;
    }

    return leaderboard[0];
  }

  getTop(
    chatId,
    limit = 10
  ) {
    const amount = Math.max(
      1,
      Number(limit) || 10
    );

    return this
      .getLeaderboard(chatId)
      .slice(0, amount);
  }

  removePlayer(
    chatId,
    playerId
  ) {
    const data =
      this.get(chatId);

    if (!data) {
      return false;
    }

    const removed =
      data.scores.delete(
        String(playerId)
      );

    if (removed) {
      data.updatedAt = Date.now();
    }

    return removed;
  }

  resetPlayer(
    chatId,
    playerId
  ) {
    return this.set(
      chatId,
      playerId,
      0
    );
  }

  reset(chatId) {
    const data =
      this.get(chatId);

    if (!data) {
      return false;
    }

    for (
      const playerId of data.scores.keys()
    ) {
      data.scores.set(
        playerId,
        0
      );
    }

    data.updatedAt = Date.now();

    return true;
  }

  delete(chatId) {
    return this.scores.delete(
      String(chatId)
    );
  }

  count(chatId) {
    const data =
      this.get(chatId);

    return data
      ? data.scores.size
      : 0;
  }

  clear() {
    this.scores.clear();
  }
}

const gameScore =
  new GameScore();

export default gameScore;
