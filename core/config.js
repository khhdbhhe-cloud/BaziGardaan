const config = {
  bot: {
    name: 'BaziGardaan',
    version: '1.0.0'
  },

  games: {
    minPlayers: 1,
    maxPlayers: 100
  },

  session: {
    defaultState: 'waiting',

    autoCleanup: true,

    cleanupDelay: 30 * 60 * 1000
  },

  scheduler: {
    enabled: true
  },

  commands: {
    enabled: true
  },

  permissions: {
    enabled: true
  },

  logging: {
    enabled: true
  }
};

export default config;
