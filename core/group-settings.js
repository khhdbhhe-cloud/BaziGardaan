class GroupSettings {
  constructor() {
    this.settings = new Map();

    console.log('⚙️ BaziGardaan Group Settings initialized');
  }

  getDefaultSettings() {
    return {
      gamesEnabled: true,
      autoStart: false,
      allowMembersToCreateGame: true,
      allowMembersToJoinGame: true,

      maxActiveGames: 1,

      welcomeEnabled: true,
      notificationsEnabled: true,

      language: 'fa',

      updatedAt: Date.now()
    };
  }

  create(chatId, initialSettings = {}) {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    const id = String(chatId);

    if (this.settings.has(id)) {
      return this.settings.get(id);
    }

    const settings = {
      ...this.getDefaultSettings(),
      ...initialSettings,
      updatedAt: Date.now()
    };

    this.settings.set(id, settings);

    console.log(
      `⚙️ Group settings created | Chat: ${id}`
    );

    return settings;
  }

  get(chatId) {
    const id = String(chatId);

    if (!this.settings.has(id)) {
      return this.create(id);
    }

    return this.settings.get(id);
  }

  has(chatId) {
    return this.settings.has(String(chatId));
  }

  set(chatId, key, value) {
    const settings = this.get(chatId);

    settings[key] = value;
    settings.updatedAt = Date.now();

    return value;
  }

  getValue(chatId, key) {
    const settings = this.get(chatId);

    return settings[key];
  }

  update(chatId, values = {}) {
    const settings = this.get(chatId);

    Object.assign(settings, values);

    settings.updatedAt = Date.now();

    return settings;
  }

  reset(chatId) {
    const id = String(chatId);

    const settings = {
      ...this.getDefaultSettings(),
      updatedAt: Date.now()
    };

    this.settings.set(id, settings);

    return settings;
  }

  enableGames(chatId) {
    return this.set(
      chatId,
      'gamesEnabled',
      true
    );
  }

  disableGames(chatId) {
    return this.set(
      chatId,
      'gamesEnabled',
      false
    );
  }

  areGamesEnabled(chatId) {
    return Boolean(
      this.getValue(chatId, 'gamesEnabled')
    );
  }

  enableAutoStart(chatId) {
    return this.set(
      chatId,
      'autoStart',
      true
    );
  }

  disableAutoStart(chatId) {
    return this.set(
      chatId,
      'autoStart',
      false
    );
  }

  canCreateGame(chatId) {
    return Boolean(
      this.getValue(
        chatId,
        'allowMembersToCreateGame'
      )
    );
  }

  canJoinGame(chatId) {
    return Boolean(
      this.getValue(
        chatId,
        'allowMembersToJoinGame'
      )
    );
  }

  remove(chatId) {
    return this.settings.delete(
      String(chatId)
    );
  }

  getAll() {
    return Array.from(
      this.settings.entries()
    ).map(([chatId, settings]) => ({
      chatId,
      ...settings
    }));
  }

  count() {
    return this.settings.size;
  }

  clear() {
    this.settings.clear();
  }
}

const groupSettings = new GroupSettings();

export default groupSettings;
