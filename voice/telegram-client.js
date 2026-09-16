import {
  TelegramClient
} from 'teleproto';

class TelegramClientManager {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  async connect(options = {}) {
    if (this.connected && this.client) {
      return this.client;
    }

    const {
      apiId,
      apiHash,
      session
    } = options;

    if (!apiId) {
      throw new Error('Telegram API ID is required.');
    }

    if (!apiHash) {
      throw new Error('Telegram API Hash is required.');
    }

    this.client = new TelegramClient(
      session || '',
      Number(apiId),
      apiHash,
      {
        connectionRetries: 5
      }
    );

    return this.client;
  }

  getClient() {
    return this.client;
  }

  isConnected() {
    return this.connected;
  }

  setConnected(value) {
    this.connected = Boolean(value);
  }

  async disconnect() {
    if (!this.client) {
      return false;
    }

    await this.client.disconnect();

    this.connected = false;

    return true;
  }
}

export default new TelegramClientManager();
