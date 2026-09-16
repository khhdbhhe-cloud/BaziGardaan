class TelegramVoiceProvider {
  constructor() {
    this.connected = false;
    this.chatId = null;
  }

  async connect(chatId, options = {}) {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    this.chatId = chatId;

    console.log(
      `🎙️ Telegram Voice Provider | Connecting: ${chatId}`
    );

    /*
     * اتصال واقعی به Telegram Voice Chat
     * در مرحله اتصال MTProto تکمیل می‌شود.
     */

    this.connected = true;

    return true;
  }

  async playAudio(chatId, audio, options = {}) {
    if (!this.connected) {
      return false;
    }

    if (!audio) {
      return false;
    }

    console.log(
      `🔊 Telegram Voice Provider | Playing audio in: ${chatId}`
    );

    return true;
  }

  async stopSpeaking(chatId) {
    if (!this.connected) {
      return false;
    }

    console.log(
      `⏹️ Telegram Voice Provider | Stop speaking: ${chatId}`
    );

    return true;
  }

  async disconnect(chatId) {
    if (!this.connected) {
      return false;
    }

    console.log(
      `🔌 Telegram Voice Provider | Disconnecting: ${chatId}`
    );

    this.connected = false;
    this.chatId = null;

    return true;
  }

  isConnected() {
    return this.connected;
  }
}

export default new TelegramVoiceProvider();
