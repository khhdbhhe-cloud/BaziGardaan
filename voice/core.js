class VoiceGameCore {
  constructor() {
    this.sessions = new Map();
  }

  create(chatId, options = {}) {
    if (this.sessions.has(chatId)) {
      throw new Error('Voice game session already exists.');
    }

    const session = {
      chatId,
      game: options.game || null,
      hostId: options.hostId || null,
      players: new Map(),
      currentPlayer: null,
      round: 0,
      running: false,
      data: {}
    };

    this.sessions.set(chatId, session);

    return session;
  }

  get(chatId) {
    return this.sessions.get(chatId) || null;
  }

  has(chatId) {
    return this.sessions.has(chatId);
  }

  addPlayer(chatId, user) {
    const session = this.get(chatId);

    if (!session || !user?.id) {
      return false;
    }

    if (session.players.has(user.id)) {
      return false;
    }

    session.players.set(user.id, {
      id: user.id,
      firstName: user.first_name || 'بازیکن',
      username: user.username || null,
      score: 0,
      ready: false
    });

    return true;
  }

  removePlayer(chatId, userId) {
    const session = this.get(chatId);

    if (!session) {
      return false;
    }

    return session.players.delete(userId);
  }

  getPlayers(chatId) {
    const session = this.get(chatId);

    if (!session) {
      return [];
    }

    return Array.from(session.players.values());
  }

  setCurrentPlayer(chatId, userId) {
    const session = this.get(chatId);

    if (!session) {
      return false;
    }

    if (!session.players.has(userId)) {
      return false;
    }

    session.currentPlayer = userId;

    return true;
  }

  getCurrentPlayer(chatId) {
    const session = this.get(chatId);

    if (!session || !session.currentPlayer) {
      return null;
    }

    return session.players.get(
      session.currentPlayer
    ) || null;
  }

  nextRound(chatId) {
    const session = this.get(chatId);

    if (!session) {
      return false;
    }

    session.round += 1;

    return session.round;
  }

  addScore(chatId, userId, points = 1) {
    const session = this.get(chatId);

    if (!session) {
      return false;
    }

    const player = session.players.get(userId);

    if (!player) {
      return false;
    }

    player.score += Number(points) || 0;

    return player.score;
  }

  start(chatId) {
    const session = this.get(chatId);

    if (!session) {
      return false;
    }

    session.running = true;
    session.round = 0;

    return true;
  }

  stop(chatId) {
    const session = this.get(chatId);

    if (!session) {
      return false;
    }

    session.running = false;

    return true;
  }

  delete(chatId) {
    return this.sessions.delete(chatId);
  }

  clear() {
    this.sessions.clear();
  }
}

export default new VoiceGameCore();
