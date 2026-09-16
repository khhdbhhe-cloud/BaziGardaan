class GroupManager {
  constructor() {
    this.groups = new Map();

    console.log('👥 BaziGardaan Group Manager initialized');
  }

  create(chat) {
    if (!chat?.id) {
      throw new Error('Valid chat information is required.');
    }

    const chatId = String(chat.id);

    const existingGroup = this.groups.get(chatId);

    if (existingGroup) {
      return existingGroup;
    }

    const group = {
      id: chatId,
      type: chat.type || 'unknown',
      title: chat.title || null,
      username: chat.username || null,

      settings: {
        gamesEnabled: true,
        autoStart: false
      },

      activeGame: null,

      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.groups.set(chatId, group);

    console.log(
      `👥 Group created | Chat: ${chatId}`
    );

    return group;
  }

  get(chatId) {
    return this.groups.get(String(chatId)) || null;
  }

  has(chatId) {
    return this.groups.has(String(chatId));
  }

  update(chatId, data = {}) {
    const group = this.get(chatId);

    if (!group) {
      return null;
    }

    Object.assign(group, data);

    group.updatedAt = Date.now();

    return group;
  }

  setSetting(chatId, key, value) {
    const group = this.get(chatId);

    if (!group) {
      throw new Error('Group not found.');
    }

    group.settings[key] = value;
    group.updatedAt = Date.now();

    return value;
  }

  getSetting(chatId, key) {
    const group = this.get(chatId);

    if (!group) {
      return undefined;
    }

    return group.settings[key];
  }

  setActiveGame(chatId, gameName) {
    const group = this.get(chatId);

    if (!group) {
      throw new Error('Group not found.');
    }

    group.activeGame = gameName || null;
    group.updatedAt = Date.now();

    return group.activeGame;
  }

  getActiveGame(chatId) {
    const group = this.get(chatId);

    if (!group) {
      return null;
    }

    return group.activeGame;
  }

  clearActiveGame(chatId) {
    return this.setActiveGame(chatId, null);
  }

  getAll() {
    return Array.from(this.groups.values());
  }

  count() {
    return this.groups.size;
  }

  remove(chatId) {
    return this.groups.delete(String(chatId));
  }

  clear() {
    this.groups.clear();
  }
}

const groupManager = new GroupManager();

export default groupManager;
