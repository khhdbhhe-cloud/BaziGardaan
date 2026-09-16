class CommandContext {
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

    this.command =
      options.command || null;

    this.args = Array.isArray(options.args)
      ? [...options.args]
      : [];

    this.text =
      options.text ??
      options.ctx?.message?.text ??
      '';

    this.chat =
      options.chat ??
      options.ctx?.chat ??
      null;

    this.user =
      options.user ??
      options.ctx?.from ??
      null;

    this.session =
      options.session || null;

    this.game =
      options.game || null;

    this.state =
      options.state || null;

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

  getCommand() {
    return this.command;
  }

  getArgs() {
    return [...this.args];
  }

  getText() {
    return this.text;
  }

  getUser() {
    return this.user;
  }

  getChat() {
    return this.chat;
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

  hasArgs() {
    return this.args.length > 0;
  }

  getArg(index, fallback = null) {
    if (
      !Number.isInteger(index) ||
      index < 0
    ) {
      return fallback;
    }

    return (
      this.args[index] ??
      fallback
    );
  }

  getFirstArg(fallback = null) {
    return this.getArg(
      0,
      fallback
    );
  }

  getRestArgs() {
    return this.args.join(' ');
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

  isGroup() {
    return (
      this.chat?.type === 'group' ||
      this.chat?.type === 'supergroup'
    );
  }

  isPrivate() {
    return this.chat?.type === 'private';
  }

  isChannel() {
    return this.chat?.type === 'channel';
  }

  isReply() {
    return Boolean(
      this.ctx?.message?.reply_to_message
    );
  }

  getReplyMessage() {
    return (
      this.ctx?.message
        ?.reply_to_message ||
      null
    );
  }

  getReplyUser() {
    return (
      this.getReplyMessage()?.from ||
      null
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

      command: this.command,
      args: [...this.args],
      text: this.text,

      chat: this.chat,
      user: this.user,

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

export default CommandContext;
