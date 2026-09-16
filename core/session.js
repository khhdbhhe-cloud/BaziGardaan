class SessionManager {
  constructor() {
    this.sessions = new Map();

    console.log('🗂️ BaziGardaan Session Manager initialized');
  }

  create(chatId, gameName) {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    if (!gameName) {
      throw new Error('Game name is required.');
    }

    if (this.sessions.has(chatId)) {
      throw new Error('A session already exists for this chat.');
    }

    const session = {
      chatId,
      gameName,
      state: 'waiting',

      players: new Map(),

      data: {},

      createdAt: Date.now(),
      startedAt: null,
      finishedAt: null
    };

    this.sessions.set(chatId, session);

    console.log(
      `🗂️ Session created | Chat: ${chatId} | Game: ${gameName}`
    );

    return session;
  }

  get(chatId) {
    return this.sessions.get(chatId);
  }

  has(chatId) {
    return this.sessions.has(chatId);
  }

  delete(chatId) {
    return this.sessions.delete(chatId);
  }

  setState(chatId, state) {
    const session = this.get(chatId);

    if (!session) {
      throw new Error('Session not found.');
    }

    session.state = state;

    if (state === 'running' && !session.startedAt) {
      session.startedAt = Date.now();
    }

    if (state === 'finished') {
      session.finishedAt = Date.now();
    }

    return session;
  }

  addPlayer(chatId, user) {
    const session = this.get(chatId);

    if (!session) {
      throw new Error('Session not found.');
    }

    if (!user?.id) {
      throw new Error('Valid user ID is required.');
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
    const session = this.get(chatId);

    if (!session) {
      return false;
    }

    return session.players.delete(userId);
  }

  getPlayer(chatId, userId) {
    const session = this.get(chatId);

    if (!session) {
      return null;
    }

    return session.players.get(userId) || null;
  }

  getPlayers(chatId) {
    const session = this.get(chatId);

    if (!session) {
      return [];
    }

    return Array.from(session.players.values());
  }

  setData(chatId, key, value) {
    const session = this.get(chatId);

    if (!session) {
      throw new Error('Session not found.');
    }

    session.data[key] = value;
  }

  getData(chatId, key) {
    const session = this.get(chatId);

    if (!session) {
      return undefined;
    }

    return session.data[key];
  }

  getAll() {
    return Array.from(this.sessions.values());
  }

  clear(chatId) {
    const session = this.get(chatId);

    if (!session) {
      return false;
    }

    session.state = 'finished';
    session.finishedAt = Date.now();

    this.sessions.delete(chatId);

    console.log(`🗑️ Session cleared | Chat: ${chatId}`);

    return true;
  }
}

const sessionManager = new SessionManager();

export default sessionManager;
