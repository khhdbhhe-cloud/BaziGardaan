class PlayerStats {
  constructor() {
    this.stats = new Map();

    console.log('📊 BaziGardaan Player Stats initialized');
  }

  create(userId) {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    const id = String(userId);

    if (this.stats.has(id)) {
      return this.stats.get(id);
    }

    const data = {
      userId: id,

      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,

      points: 0,

      currentWinStreak: 0,
      bestWinStreak: 0,

      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.stats.set(id, data);

    console.log(
      `📊 Player stats created | User: ${id}`
    );

    return data;
  }

  get(userId) {
    if (!userId) {
      return null;
    }

    const id = String(userId);

    if (!this.stats.has(id)) {
      return this.create(id);
    }

    return this.stats.get(id);
  }

  addGame(userId) {
    const stats = this.get(userId);

    stats.games += 1;
    stats.updatedAt = Date.now();

    return stats;
  }

  addWin(userId, points = 0) {
    const stats = this.get(userId);

    stats.wins += 1;
    stats.games += 1;
    stats.points += Number(points) || 0;

    stats.currentWinStreak += 1;

    if (
      stats.currentWinStreak >
      stats.bestWinStreak
    ) {
      stats.bestWinStreak =
        stats.currentWinStreak;
    }

    stats.updatedAt = Date.now();

    return stats;
  }

  addLoss(userId) {
    const stats = this.get(userId);

    stats.losses += 1;
    stats.games += 1;

    stats.currentWinStreak = 0;
    stats.updatedAt = Date.now();

    return stats;
  }

  addDraw(userId, points = 0) {
    const stats = this.get(userId);

    stats.draws += 1;
    stats.games += 1;
    stats.points += Number(points) || 0;

    stats.currentWinStreak = 0;
    stats.updatedAt = Date.now();

    return stats;
  }

  addPoints(userId, points) {
    const stats = this.get(userId);

    const amount = Number(points);

    if (!Number.isFinite(amount)) {
      throw new Error('Points must be a valid number.');
    }

    stats.points += amount;
    stats.updatedAt = Date.now();

    return stats.points;
  }

  reset(userId) {
    if (!userId) {
      return false;
    }

    const id = String(userId);

    this.stats.set(id, {
      userId: id,

      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,

      points: 0,

      currentWinStreak: 0,
      bestWinStreak: 0,

      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    return true;
  }

  getWinRate(userId) {
    const stats = this.get(userId);

    if (!stats || stats.games === 0) {
      return 0;
    }

    return (
      stats.wins /
      stats.games
    ) * 100;
  }

  getAll() {
    return Array.from(
      this.stats.values()
    );
  }

  getLeaderboard(limit = 10) {
    const amount = Math.max(
      1,
      Number(limit) || 10
    );

    return this.getAll()
      .sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }

        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }

        return (
          b.bestWinStreak -
          a.bestWinStreak
        );
      })
      .slice(0, amount);
  }

  has(userId) {
    return this.stats.has(String(userId));
  }

  remove(userId) {
    return this.stats.delete(
      String(userId)
    );
  }

  count() {
    return this.stats.size;
  }

  clear() {
    this.stats.clear();
  }
}

const playerStats = new PlayerStats();

export default playerStats;
