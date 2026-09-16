class GameResult {
  constructor(options = {}) {
    this.chatId = options.chatId ?? null;
    this.gameName = options.gameName || null;

    this.status = options.status || 'finished';

    this.winners = Array.isArray(options.winners)
      ? [...options.winners]
      : [];

    this.players = Array.isArray(options.players)
      ? [...options.players]
      : [];

    this.scores = options.scores
      ? { ...options.scores }
      : {};

    this.data = options.data
      ? { ...options.data }
      : {};

    this.startedAt = options.startedAt || null;
    this.finishedAt =
      options.finishedAt || Date.now();
  }

  addWinner(playerId) {
    if (
      playerId === null ||
      playerId === undefined
    ) {
      return false;
    }

    if (!this.winners.includes(playerId)) {
      this.winners.push(playerId);
    }

    return true;
  }

  removeWinner(playerId) {
    const index = this.winners.indexOf(
      playerId
    );

    if (index === -1) {
      return false;
    }

    this.winners.splice(index, 1);

    return true;
  }

  isWinner(playerId) {
    return this.winners.includes(playerId);
  }

  setScore(playerId, score) {
    if (
      playerId === null ||
      playerId === undefined
    ) {
      throw new Error('Player ID is required.');
    }

    const numericScore = Number(score);

    if (!Number.isFinite(numericScore)) {
      throw new Error(
        'Score must be a valid number.'
      );
    }

    this.scores[String(playerId)] =
      numericScore;

    return numericScore;
  }

  getScore(playerId) {
    return (
      this.scores[String(playerId)] ?? 0
    );
  }

  getScores() {
    return {
      ...this.scores
    };
  }

  setData(key, value) {
    this.data[key] = value;

    return value;
  }

  getData(key) {
    return this.data[key];
  }

  getDuration() {
    if (!this.startedAt) {
      return 0;
    }

    return Math.max(
      0,
      this.finishedAt - this.startedAt
    );
  }

  toJSON() {
    return {
      chatId: this.chatId,
      gameName: this.gameName,
      status: this.status,

      winners: [...this.winners],
      players: [...this.players],

      scores: {
        ...this.scores
      },

      data: {
        ...this.data
      },

      startedAt: this.startedAt,
      finishedAt: this.finishedAt,
      duration: this.getDuration()
    };
  }
}

export default GameResult;
