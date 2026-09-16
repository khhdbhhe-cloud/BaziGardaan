class ResponseManager {
  constructor() {
    this.defaultParseMode = undefined;

    console.log(
      '💬 BaziGardaan Response Manager initialized'
    );
  }

  success(message, data = null) {
    return {
      success: true,
      message,
      data
    };
  }

  failure(message, data = null) {
    return {
      success: false,
      message,
      data
    };
  }

  text(message, extra = {}) {
    return {
      type: 'text',
      text: String(message ?? ''),
      extra: {
        ...extra
      }
    };
  }

  error(message, code = null, data = null) {
    return {
      success: false,
      type: 'error',
      message: String(message ?? ''),
      code,
      data
    };
  }

  game(message, data = {}) {
    return {
      success: true,
      type: 'game',
      message: String(message ?? ''),
      data: {
        ...data
      }
    };
  }

  action(action, data = {}) {
    return {
      success: true,
      type: 'action',
      action,
      data: {
        ...data
      }
    };
  }

  reply(message, extra = {}) {
    return this.text(message, {
      reply: true,
      ...extra
    });
  }

  edit(message, extra = {}) {
    return this.text(message, {
      edit: true,
      ...extra
    });
  }

  silent(data = {}) {
    return {
      success: true,
      silent: true,
      data: {
        ...data
      }
    };
  }

  isSuccess(response) {
    return Boolean(
      response &&
      response.success === true
    );
  }

  isFailure(response) {
    return Boolean(
      response &&
      response.success === false
    );
  }

  isSilent(response) {
    return Boolean(
      response &&
      response.silent === true
    );
  }

  normalize(response) {
    if (response === null || response === undefined) {
      return this.silent();
    }

    if (typeof response === 'string') {
      return this.text(response);
    }

    if (typeof response === 'object') {
      return {
        ...response
      };
    }

    return this.text(String(response));
  }

  async send(ctx, response) {
    if (!ctx) {
      return false;
    }

    const normalized =
      this.normalize(response);

    if (this.isSilent(normalized)) {
      return false;
    }

    if (
      normalized.type === 'text' ||
      normalized.message
    ) {
      const message =
        normalized.text ??
        normalized.message ??
        '';

      const extra = {
        ...(normalized.extra || {})
      };

      if (
        this.defaultParseMode &&
        !extra.parse_mode
      ) {
        extra.parse_mode =
          this.defaultParseMode;
      }

      if (normalized.reply) {
        extra.reply_to_message_id =
          ctx.message?.message_id;
      }

      if (
        normalized.edit &&
        ctx.editMessageText
      ) {
        await ctx.editMessageText(
          message,
          extra
        );

        return true;
      }

      if (ctx.reply) {
        await ctx.reply(
          message,
          extra
        );

        return true;
      }
    }

    return false;
  }

  setDefaultParseMode(mode) {
    this.defaultParseMode =
      mode || undefined;

    return this.defaultParseMode;
  }

  clearDefaultParseMode() {
    this.defaultParseMode = undefined;
  }
}

const responseManager =
  new ResponseManager();

export default responseManager;
