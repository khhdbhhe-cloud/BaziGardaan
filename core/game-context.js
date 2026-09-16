class GameContext {
  constructor(options = {}) {
    this.ctx = options.ctx || null;

    this.chatId =
      options.chatId ??
      options.ctx?.chat?.id ??
      null;

    this.userId =
      options.userId ??
      options.ctx?.from?.id ??
      null;

    this.messageId =
      options.messageId ??
      options.ctx?.message?.message_id ??
      null;

    this.gameName =
      options.gameName ??
      options.session?.gameName ??
      options.game?.name ??
      null;

    this.session =
      options.session || null;

    this.game =
      options.game || null;

    this.state =
      options.state || null;

    this.players = Array.isArray(options.players)
      ? [...options.players]
      : [];

    this.data = {
      ...(options.data || {})
    };

    this.createdAt = Date.now();
  }

  getChatId() {
    return this.chatId;
  }

  getUserId() {
    return this.userId;
  }

  getMessageId() {
    return this.messageId;
  }

  getGameName() {
    return this.gameName;
  }

  getSession() {
    return this.session;
  }

  getGame() {
    return this.game;
  }

  getState() {
    return this.state;
  }

  getPlayers() {
    return [...this.players];
  }

  getPlayerCount() {
    return this.players.length;
  }

  findPlayer(userId) {
    if (
      userId === null ||
      userId === undefined
    ) {
      return null;
    }

    return (
      this.players.find(
        (player) =>
          String(player?.id) ===
          String(userId)
      ) || null
    );
  }

  hasPlayer(userId) {
    return Boolean(
      this.findPlayer(userId)
    );
  }

  getCurrentPlayer() {
    const currentId =
      this.state?.currentPlayerId;

    if (
      currentId === null ||
      currentId === undefined
    ) {
      return null;
    }

    return this.findPlayer(currentId);
  }

  setData(key, value) {
    this.data[key] = value;

    return value;
  }

  getData(key, fallback = null) {
    return Object.prototype.hasOwnProperty.call(
      this.data,
      key
    )
      ? this.data[key]
      : fallback;
  }

  hasData(key) {
    return Object.prototype.hasOwnProperty.call(
      this.data,
      key
    );
  }

  deleteData(key) {
    if (!this.hasData(key)) {
      return false;
    }

    delete this.data[key];

    return true;
  }

  isWaiting() {
    return this.session?.state === 'waiting';
  }

  isRunning() {
    return this.session?.state === 'running';
  }

  isFinished() {
    return this.session?.state === 'finished';
  }

  isGroup() {
    const type =
      this.ctx?.chat?.type;

    return (
      type === 'group' ||
      type === 'supergroup'
    );
  }

  isPrivate() {
    return (
      this.ctx?.chat?.type ===
      'private'
    );
  }

  async reply(message, extra = {}) {
    if (!this.ctx?.reply) {
      return null;
    }

    return this.ctx.reply(
      message,
      extra
    );
  }

  async deleteMessage() {
    if (!this.ctx?.deleteMessage) {
      return false;
    }

    return this.ctx.deleteMessage();
  }

  async answerCbQuery(
    text = '',
    extra = {}
  ) {
    if (!this.ctx?.answerCbQuery) {
      return null;
    }

    return this.ctx.answerCbQuery(
      text,
      extra
    );
  }

  toJSON() {
    return {
      chatId: this.chatId,
      userId: this.userId,
      messageId: this.messageId,

      gameName: this.gameName,

      session: this.session,
      game: this.game,
      state: this.state,

      players: [...this.players],

      data: {
        ...this.data
      },

      createdAt: this.createdAt
    };
  }
}

export default GameContext;
