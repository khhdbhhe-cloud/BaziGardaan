class GameLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 500;

    console.log(
      '📋 BaziGardaan Game Logger initialized'
    );
  }

  add(type, message, data = {}) {
    const log = {
      id: this.logs.length + 1,

      type: String(type || 'info'),

      message: String(
        message || ''
      ),

      data: {
        ...data
      },

      createdAt: Date.now()
    };

    this.logs.push(log);

    if (
      this.logs.length >
      this.maxLogs
    ) {
      this.logs.shift();
    }

    this.print(log);

    return log;
  }

  info(message, data = {}) {
    return this.add(
      'info',
      message,
      data
    );
  }

  start(
    chatId,
    gameName
  ) {
    return this.add(
      'start',
      `Game started | ${gameName}`,
      {
        chatId,
        gameName
      }
    );
  }

  stop(
    chatId,
    gameName
  ) {
    return this.add(
      'stop',
      `Game stopped | ${gameName}`,
      {
        chatId,
        gameName
      }
    );
  }

  join(
    chatId,
    playerId
  ) {
    return this.add(
      'join',
      'Player joined game.',
      {
        chatId,
        playerId
      }
    );
  }

  leave(
    chatId,
    playerId
  ) {
    return this.add(
      'leave',
      'Player left game.',
      {
        chatId,
        playerId
      }
    );
  }

  turn(
    chatId,
    playerId,
    turnNumber
  ) {
    return this.add(
      'turn',
      'Game turn changed.',
      {
        chatId,
        playerId,
        turnNumber
      }
    );
  }

  score(
    chatId,
    playerId,
    points
  ) {
    return this.add(
      'score',
      'Player score updated.',
      {
        chatId,
        playerId,
        points
      }
    );
  }

  finish(
    chatId,
    gameName,
    winners = []
  ) {
    return this.add(
      'finish',
      `Game finished | ${gameName}`,
      {
        chatId,
        gameName,
        winners: Array.isArray(winners)
          ? [...winners]
          : []
      }
    );
  }

  error(
    message,
    data = {}
  ) {
    return this.add(
      'error',
      message,
      data
    );
  }

  print(log) {
    const prefix = {
      info: 'ℹ️',
      start: '▶️',
      stop: '⏹️',
      join: '👤',
      leave: '🚪',
      turn: '🔄',
      score: '🏆',
      finish: '🏁',
      error: '❌'
    };

    const icon =
      prefix[log.type] || '📋';

    console.log(
      `${icon} [GAME] ${log.message}`,
      log.data
    );
  }

  get(id) {
    return (
      this.logs.find(
        (log) =>
          log.id === Number(id)
      ) || null
    );
  }

  getRecent(limit = 20) {
    const amount = Math.max(
      1,
      Number(limit) || 20
    );

    return this.logs
      .slice(-amount)
      .reverse();
  }

  getByType(type) {
    if (!type) {
      return [];
    }

    return this.logs.filter(
      (log) =>
        log.type === type
    );
  }

  getByChat(chatId) {
    return this.logs.filter(
      (log) =>
        String(log.data?.chatId) ===
        String(chatId)
    );
  }

  count() {
    return this.logs.length;
  }

  clear() {
    this.logs = [];
  }

  setMaxLogs(limit) {
    const amount = Number(limit);

    if (
      !Number.isInteger(amount) ||
      amount < 1
    ) {
      throw new Error(
        'Log limit must be a positive integer.'
      );
    }

    this.maxLogs = amount;

    while (
      this.logs.length >
      this.maxLogs
    ) {
      this.logs.shift();
    }

    return this.maxLogs;
  }
}

const gameLogger =
  new GameLogger();

export default gameLogger;
