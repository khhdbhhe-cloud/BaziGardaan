class GameEngine {
  constructor() {
    this.sessions = new Map();
    this.games = new Map();

    console.log('🧠 BaziGardaan Game Engine initialized');
  }

  registerGame(name, game) {
    if (!name || !game) {
      throw new Error('Game name and game module are required.');
    }

    if (this.games.has(name)) {
      throw new Error(`Game "${name}" is already registered.`);
    }

    this.games.set(name, game);

    console.log(`🎮 Game registered: ${name}`);
  }

  getGame(name) {
    return this.games.get(name);
  }

  hasGame(name) {
    return this.games.has(name);
  }

  createSession(chatId, gameName) {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    if (!this.hasGame(gameName)) {
      throw new Error(`Game "${gameName}" is not registered.`);
    }

    const existingSession = this.sessions.get(chatId);

    if (existingSession) {
      throw new Error('A game session is already active in this chat.');
    }

    const session = {
      chatId,
      gameName,
      players: new Map(),
      state: 'waiting',
      createdAt: Date.now(),
      data: {}
    };

    this.sessions.set(chatId, session);

    console.log(
      `🕹️ Session created | Chat: ${chatId} | Game: ${gameName}`
    );

    return session;
  }

  getSession(chatId) {
    return this.sessions.get(chatId);
  }

  hasSession(chatId) {
    return this.sessions.has(chatId);
  }

  addPlayer(chatId, user) {
    const session = this.getSession(chatId);

    if (!session) {
      throw new Error('No active game session.');
    }

    if (!user?.id) {
      throw new Error('Valid user information is required.');
    }

    if (session.players.has(user.id)) {
      return false;
    }

    session.players.set(user.id, {
      id: user.id,
      username: user.username || null,
      firstName: user.first_name || user.firstName || 'Player',
      joinedAt: Date.now()
    });

    return true;
  }

  removePlayer(chatId, userId) {
    const session = this.getSession(chatId);

    if (!session) {
      return false;
    }

    return session.players.delete(userId);
  }

  getPlayers(chatId) {
    const session = this.getSession(chatId);

    if (!session) {
      return [];
    }

    return Array.from(session.players.values());
  }

  startGame(chatId) {
    const session = this.getSession(chatId);

    if (!session) {
      throw new Error('No active game session.');
    }

    if (session.players.size === 0) {
      throw new Error('At least one player is required.');
    }

    session.state = 'running';
    session.startedAt = Date.now();

    console.log(
      `▶️ Game started | Chat: ${chatId} | Game: ${session.gameName}`
    );

    return session;
  }

  stopGame(chatId) {
    const session = this.getSession(chatId);

    if (!session) {
      return false;
    }

    session.state = 'finished';
    session.finishedAt = Date.now();

    this.sessions.delete(chatId);

    console.log(`⏹️ Game stopped | Chat: ${chatId}`);

    return true;
  }

  setSessionData(chatId, key, value) {
    const session = this.getSession(chatId);

    if (!session) {
      throw new Error('No active game session.');
    }

    session.data[key] = value;
  }

  getSessionData(chatId, key) {
    const session = this.getSession(chatId);

    if (!session) {
      return undefined;
    }

    return session.data[key];
  }

  listGames() {
    return Array.from(this.games.keys());
  }

  listSessions() {
    return Array.from(this.sessions.values());
  }
}

const gameEngine = new GameEngine();

export default gameEngine;
