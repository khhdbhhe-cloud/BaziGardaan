import voiceCore from './core.js';

class VoiceGameGod {
  constructor() {
    this.core = voiceCore;
    this.games = new Map();
  }

  register(game) {
    if (!game?.name) {
      throw new Error('Voice game name is required.');
    }

    if (this.games.has(game.name)) {
      throw new Error(
        `Voice game "${game.name}" is already registered.`
      );
    }

    this.games.set(game.name, game);

    console.log(
      `🎙️ Voice game registered: ${game.name}`
    );

    return game;
  }

  get(name) {
    return this.games.get(name) || null;
  }

  list() {
    return Array.from(this.games.values());
  }

  start(chatId, gameName, hostId) {
    const game = this.get(gameName);

    if (!game) {
      throw new Error(
        `Voice game "${gameName}" not found.`
      );
    }

    const session = this.core.create(chatId, {
      game: gameName,
      hostId
    });

    this.core.start(chatId);

    if (typeof game.onStart === 'function') {
      game.onStart({
        chatId,
        session,
        game,
        core: this.core
      });
    }

    return session;
  }

  stop(chatId) {
    const session = this.core.get(chatId);

    if (!session) {
      return false;
    }

    const game = this.get(session.game);

    this.core.stop(chatId);

    if (game && typeof game.onStop === 'function') {
      game.onStop({
        chatId,
        session,
        game,
        core: this.core
      });
    }

    return true;
  }

  addPlayer(chatId, user) {
    return this.core.addPlayer(chatId, user);
  }

  removePlayer(chatId, userId) {
    return this.core.removePlayer(
      chatId,
      userId
    );
  }

  getPlayers(chatId) {
    return this.core.getPlayers(chatId);
  }

  nextTurn(chatId, userId) {
    const session = this.core.get(chatId);

    if (!session) {
      return false;
    }

    return this.core.setCurrentPlayer(
      chatId,
      userId
    );
  }

  nextRound(chatId) {
    return this.core.nextRound(chatId);
  }

  speak(chatId, text) {
    const session = this.core.get(chatId);

    if (!session || !session.running) {
      return false;
    }

    console.log(
      `🎙️ Voice God | ${chatId}: ${text}`
    );

    return true;
  }

  announce(chatId, text) {
    return this.speak(chatId, text);
  }

  addScore(chatId, userId, points = 1) {
    return this.core.addScore(
      chatId,
      userId,
      points
    );
  }

  finish(chatId, result = {}) {
    const session = this.core.get(chatId);

    if (!session) {
      return false;
    }

    const game = this.get(session.game);

    if (game && typeof game.onFinish === 'function') {
      game.onFinish({
        chatId,
        session,
        game,
        result,
        core: this.core
      });
    }

    this.core.stop(chatId);

    return true;
  }
}

export default new VoiceGameGod();
