class PlayerManager {
  constructor() {
    this.players = new Map();

    console.log('👤 BaziGardaan Player Manager initialized');
  }

  create(user) {
    if (!user?.id) {
      throw new Error('Valid user ID is required.');
    }

    const existingPlayer = this.players.get(user.id);

    if (existingPlayer) {
      return existingPlayer;
    }

    const player = {
      id: user.id,
      username: user.username || null,
      firstName: user.first_name || user.firstName || 'Player',
      lastName: user.last_name || user.lastName || null,

      status: 'active',

      stats: {
        games: 0,
        wins: 0,
        losses: 0,
        points: 0
      },

      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.players.set(user.id, player);

    console.log(`👤 Player created: ${user.id}`);

    return player;
  }

  get(userId) {
    return this.players.get(userId) || null;
  }

  has(userId) {
    return this.players.has(userId);
  }

  update(userId, data = {}) {
    const player = this.get(userId);

    if (!player) {
      return null;
    }

    Object.assign(player, data);
    player.updatedAt = Date.now();

    return player;
  }

  setStatus(userId, status) {
    const player = this.get(userId);

    if (!player) {
      return null;
    }

    player.status = status;
    player.updatedAt = Date.now();

    return player;
  }

  addGame(userId) {
    const player = this.get(userId);

    if (!player) {
      return null;
    }

    player.stats.games += 1;
    player.updatedAt = Date.now();

    return player;
  }

  addWin(userId, points = 0) {
    const player = this.get(userId);

    if (!player) {
      return null;
    }

    player.stats.wins += 1;
    player.stats.points += points;
    player.updatedAt = Date.now();

    return player;
  }

  addLoss(userId) {
    const player = this.get(userId);

    if (!player) {
      return null;
    }

    player.stats.losses += 1;
    player.updatedAt = Date.now();

    return player;
  }

  getStats(userId) {
    const player = this.get(userId);

    if (!player) {
      return null;
    }

    return {
      ...player.stats
    };
  }

  getAll() {
    return Array.from(this.players.values());
  }

  remove(userId) {
    return this.players.delete(userId);
  }

  clear() {
    this.players.clear();
  }
}

const playerManager = new PlayerManager();

export default playerManager;
