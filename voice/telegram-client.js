import {
  TelegramClient
} from 'teleproto';

import {
  StringSession
} from 'teleproto/sessions';

class TelegramClientManager {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  create() {
    const apiId = Number(
      process.env.TG_API_ID
    );

    const apiHash =
      process.env.TG_API_HASH;

    if (!apiId) {
      throw new Error(
        'TG_API_ID is missing.'
      );
    }

    if (!apiHash) {
      throw new Error(
        'TG_API_HASH is missing.'
      );
    }

    const session =
      new StringSession(
        process.env.TG_SESSION || ''
      );

    this.client =
      new TelegramClient(
        session,
        apiId,
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
    this.connected =
      Boolean(value);
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
