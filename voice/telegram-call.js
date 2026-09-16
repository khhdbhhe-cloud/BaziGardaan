class TelegramVoiceCall {
  constructor() {
    this.calls = new Map();
  }

  create(chatId, options = {}) {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    if (this.calls.has(chatId)) {
      throw new Error(
        'Voice call session already exists.'
      );
    }

    const call = {
      chatId,
      callId: options.callId || null,
      connected: false,
      speaking: false,
      audioQueue: [],
      provider: null
    };

    this.calls.set(chatId, call);

    return call;
  }

  get(chatId) {
    return this.calls.get(chatId) || null;
  }

  has(chatId) {
    return this.calls.has(chatId);
  }

  setProvider(chatId, provider) {
    const call = this.get(chatId);

    if (!call) {
      return false;
    }

    if (
      !provider ||
      typeof provider.connect !== 'function'
    ) {
      throw new Error(
        'Invalid voice call provider.'
      );
    }

    call.provider = provider;

    return true;
  }

  async connect(chatId, options = {}) {
    const call = this.get(chatId);

    if (!call) {
      throw new Error(
        'Voice call session not found.'
      );
    }

    if (!call.provider) {
      throw new Error(
        'Voice call provider is not configured.'
      );
    }

    await call.provider.connect(
      chatId,
      options
    );

    call.connected = true;

    return true;
  }

  async playAudio(chatId, audio, options = {}) {
    const call = this.get(chatId);

    if (!call || !call.connected) {
      return false;
    }

    if (!audio) {
      return false;
    }

    if (
      !call.provider ||
      typeof call.provider.playAudio !== 'function'
    ) {
      return false;
    }

    call.speaking = true;

    try {
      await call.provider.playAudio(
        chatId,
        audio,
        options
      );

      return true;
    } finally {
      call.speaking = false;
    }
  }

  async stopSpeaking(chatId) {
    const call = this.get(chatId);

    if (!call || !call.provider) {
      return false;
    }

    if (
      typeof call.provider.stopSpeaking ===
      'function'
    ) {
      await call.provider.stopSpeaking(
        chatId
      );
    }

    call.speaking = false;

    return true;
  }

  async disconnect(chatId) {
    const call = this.get(chatId);

    if (!call) {
      return false;
    }

    if (
      call.provider &&
      typeof call.provider.disconnect ===
      'function'
    ) {
      await call.provider.disconnect(
        chatId
      );
    }

    call.connected = false;
    call.speaking = false;

    return true;
  }

  delete(chatId) {
    return this.calls.delete(chatId);
  }

  clear() {
    this.calls.clear();
  }

  isConnected(chatId) {
    const call = this.get(chatId);

    return Boolean(
      call &&
      call.connected
    );
  }

  isSpeaking(chatId) {
    const call = this.get(chatId);

    return Boolean(
      call &&
      call.speaking
    );
  }
}

export default new TelegramVoiceCall();
