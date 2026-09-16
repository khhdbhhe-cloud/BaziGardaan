class GameContext {
  constructor(options = {}) {
    this.ctx = options.ctx || null;

    this.chatId =
      options.chatId ??
      options.ctx?.chat?.id ??
      options.ctx?.chat?.id?.toString() ??
      null;

    this.userId =
      options.userId ??
      options.ctx?.from?.id ??
      null;

    this.session = options.session || null;
    this.game = options.game || null;

    this.engine = options.engine || null;
    this.players = options.players || null;

    this.state = options.state || null;

    this.data = options.data || {};

    this.createdAt = Date.now();
  }

  getChatId() {
    return this.chatId;
  }

  getUserId() {
    return this.userId;
  }

  getUser() {
    return this.ctx?.from || null;
  }

  getChat() {
    return this.ctx?.chat || null;
  }

  getMessage() {
    return this.ctx?.message || null;
  }

  getText() {
    return this.ctx?.message?.text || '';
  }

  isGroup() {
    const type = this.getChat()?.type;

    return (
      type === 'group' ||
      type === 'supergroup'
    );
  }

  isPrivate() {
    return this.getChat()?.type === 'private';
  }

  setData(key, value) {
    this.data[key] = value;

    return value;
  }

  getData(key) {
    return this.data[key];
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

  async reply(text, extra = {}) {
    if (!this.ctx?.reply) {
      return null;
    }

    return this.ctx.reply(text, extra);
  }

  async answerCbQuery(text = '', extra = {}) {
    if (!this.ctx?.answerCbQuery) {
      return null;
    }

    return this.ctx.answerCbQuery(text, extra);
  }

  async deleteMessage() {
    if (!this.ctx?.deleteMessage) {
      return false;
    }

    return this.ctx.deleteMessage();
  }

  toJSON() {
    return {
      chatId: this.chatId,
      userId: this.userId,
      session: this.session,
      game: this.game,
      state: this.state,
      data: {
        ...this.data
      },
      createdAt: this.createdAt
    };
  }
}

export default GameContext;
