class PermissionManager {
  constructor() {
    this.permissions = new Map();

    console.log('🔐 BaziGardaan Permission Manager initialized');
  }

  createKey(chatId, userId) {
    return `${chatId}:${userId}`;
  }

  grant(chatId, userId, permission) {
    if (!chatId) {
      throw new Error('Chat ID is required.');
    }

    if (!userId) {
      throw new Error('User ID is required.');
    }

    if (!permission) {
      throw new Error('Permission is required.');
    }

    const key = this.createKey(chatId, userId);

    if (!this.permissions.has(key)) {
      this.permissions.set(key, new Set());
    }

    this.permissions.get(key).add(permission);

    return true;
  }

  revoke(chatId, userId, permission) {
    const key = this.createKey(chatId, userId);
    const userPermissions = this.permissions.get(key);

    if (!userPermissions) {
      return false;
    }

    const removed = userPermissions.delete(permission);

    if (userPermissions.size === 0) {
      this.permissions.delete(key);
    }

    return removed;
  }

  has(chatId, userId, permission) {
    const key = this.createKey(chatId, userId);
    const userPermissions = this.permissions.get(key);

    if (!userPermissions) {
      return false;
    }

    return userPermissions.has(permission);
  }

  grantMany(chatId, userId, permissions = []) {
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions must be an array.');
    }

    for (const permission of permissions) {
      this.grant(chatId, userId, permission);
    }

    return true;
  }

  revokeMany(chatId, userId, permissions = []) {
    if (!Array.isArray(permissions)) {
      throw new Error('Permissions must be an array.');
    }

    for (const permission of permissions) {
      this.revoke(chatId, userId, permission);
    }

    return true;
  }

  get(chatId, userId) {
    const key = this.createKey(chatId, userId);
    const userPermissions = this.permissions.get(key);

    if (!userPermissions) {
      return [];
    }

    return Array.from(userPermissions);
  }

  clearUser(chatId, userId) {
    const key = this.createKey(chatId, userId);

    return this.permissions.delete(key);
  }

  clearChat(chatId) {
    const prefix = `${chatId}:`;
    let removed = 0;

    for (const key of this.permissions.keys()) {
      if (key.startsWith(prefix)) {
        this.permissions.delete(key);
        removed += 1;
      }
    }

    return removed;
  }

  clearAll() {
    this.permissions.clear();
  }
}

const permissionManager = new PermissionManager();

export default permissionManager;
