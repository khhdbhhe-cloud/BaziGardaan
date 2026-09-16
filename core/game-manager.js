import gameEngine from './engine.js';
import sessionManager from './session.js';
import gameRegistry from './game-registry.js';
import gameState from './game-state.js';
import playerManager from './player.js';
import logger from './logger.js';

class GameManager {
  constructor() {
    this.engine = gameEngine;
    this.sessions = sessionManager;
    this.registry = gameRegistry;
    this.states = gameState;
    this.players = playerManager;

    console.log('🎮 BaziGardaan Game Manager initialized');
  }

  registerGame(game) {
    return this.registry.register(game);
  }

  getGame(gameName) {
    return this.registry.get(gameName);
  }

  hasGame(gameName) {
    return this.registry.has(gameName);
  }

  listGames() {
    return this.registry.list();
  }

  createGame(chatId, gameName) {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    if (!gameName) {
      throw new Error('Game name is required.');
    }

    if (this.sessions.has(chatId)) {
      throw new Error(
        'A game session is already active in this chat.'
      );
    }

    const game = this.getGame(gameName);

    if (!game) {
      throw new Error(
        `Game "${gameName}" is not registered.`
      );
    }

    const session = this.sessions.create(
      chatId,
      gameName
    );

    this.states.create(
      chatId,
      gameName
    );

    logger.game(
      `Game created | Chat: ${chatId} | Game: ${gameName}`
    );

    return session;
  }

  getSession(chatId) {
    return this.sessions.get(chatId);
  }

  getState(chatId) {
    return this.states.get(chatId);
  }

  addPlayer(chatId, user) {
    const session = this.getSession(chatId);

    if (!session) {
      throw new Error('No active game session.');
    }

    const game = this.getGame(
      session.gameName
    );

    if (!game) {
      throw new Error('Game not found.');
    }

    if (
      game.maxPlayers &&
      session.players.size >= game.maxPlayers
    ) {
      return false;
    }

    const player = this.players.create(user);

    const added = this.sessions.addPlayer(
      chatId,
      user
    );

    if (!added) {
      return false;
    }

    if (typeof game.onPlayerJoin === 'function') {
      const context = {
        chatId,
        session,
        state: this.getState(chatId),
        game,
        player
      };

      Promise.resolve(
        game.onPlayerJoin(context, player)
      ).catch((error) => {
        logger.error(
          'Game player join handler failed.',
          error
        );
      });
    }

    return true;
  }

  removePlayer(chatId, userId) {
    const session = this.getSession(chatId);

    if (!session) {
      return false;
    }

    const player =
      this.sessions.getPlayer(
        chatId,
        userId
      );

    const removed =
      this.sessions.removePlayer(
        chatId,
        userId
      );

    if (
      removed &&
      player
    ) {
      const game = this.getGame(
        session.gameName
      );

      if (
        game &&
        typeof game.onPlayerLeave === 'function'
      ) {
        const context = {
          chatId,
          session,
          state: this.getState(chatId),
          game
        };

        Promise.resolve(
          game.onPlayerLeave(
            context,
            player
          )
        ).catch((error) => {
          logger.error(
            'Game player leave handler failed.',
            error
          );
        });
      }
    }

    return removed;
  }

  getPlayers(chatId) {
    return this.sessions.getPlayers(chatId);
  }

  canStart(chatId) {
    const session = this.getSession(chatId);

    if (!session) {
      return false;
    }

    const game = this.getGame(
      session.gameName
    );

    if (!game) {
      return false;
    }

    if (
      typeof game.canStart === 'function'
    ) {
      return game.canStart(
        session.players.size
      );
    }

    return session.players.size > 0;
  }

  async startGame(chatId) {
    const session = this.getSession(chatId);

    if (!session) {
      throw new Error('No active game session.');
    }

    const game = this.getGame(
      session.gameName
    );

    if (!game) {
      throw new Error('Game not found.');
    }

    if (!this.canStart(chatId)) {
      throw new Error(
        'The game cannot start with the current number of players.'
      );
    }

    this.sessions.setState(
      chatId,
      'running'
    );

    this.states.setStatus(
      chatId,
      'running'
    );

    const context = {
      chatId,
      session,
      state: this.getState(chatId),
      game,
      players: this.getPlayers(chatId)
    };

    if (typeof game.onCreate === 'function') {
      await game.onCreate(context);
    }

    if (typeof game.onStart === 'function') {
      await game.onStart(context);
    }

    logger.game(
      `Game started | Chat: ${chatId} | Game: ${session.gameName}`
    );

    return session;
  }

  async stopGame(chatId) {
    const session = this.getSession(chatId);

    if (!session) {
      return false;
    }

    const game = this.getGame(
      session.gameName
    );

    const context = {
      chatId,
      session,
      state: this.getState(chatId),
      game,
      players: this.getPlayers(chatId)
    };

    if (
      game &&
      typeof game.onStop === 'function'
    ) {
      await game.onStop(context);
    }

    this.states.clear(chatId);
    this.sessions.clear(chatId);

    logger.game(
      `Game stopped | Chat: ${chatId}`
    );

    return true;
  }

  async finishGame(
    chatId,
    result = {}
  ) {
    const session = this.getSession(chatId);

    if (!session) {
      return false;
    }

    const game = this.getGame(
      session.gameName
    );

    const context = {
      chatId,
      session,
      state: this.getState(chatId),
      game,
      players: this.getPlayers(chatId),
      result
    };

    if (
      game &&
      typeof game.onFinish === 'function'
    ) {
      await game.onFinish(
        context,
        result
      );
    }

    this.sessions.setState(
      chatId,
      'finished'
    );

    this.states.setStatus(
      chatId,
      'finished'
    );

    logger.game(
      `Game finished | Chat: ${chatId}`
    );

    return result;
  }

  isRunning(chatId) {
    const session = this.getSession(chatId);

    return Boolean(
      session &&
      session.state === 'running'
    );
  }

  getActiveGames() {
    return this.sessions
      .getAll()
      .filter(
        (session) =>
          session.state === 'running'
      );
  }

  getWaitingGames() {
    return this.sessions
      .getAll()
      .filter(
        (session) =>
          session.state === 'waiting'
      );
  }

  getGameInfo(gameName) {
    return this.registry.getInfo(
      gameName
    );
  }
}

const gameManager = new GameManager();

export default gameManager;
