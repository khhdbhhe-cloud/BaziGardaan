import BaseGame from '../core/game.js';

class RockPaperScissors extends BaseGame {
  constructor() {
    super({
      name: 'rock-paper-scissors',
      displayName: 'سنگ کاغذ قیچی',
      minPlayers: 2,
      maxPlayers: 20,
      settings: {
        rounds: 3
      }
    });
  }

  async onCreate(context) {
    context.state.data = {
      rounds: this.settings.rounds,
      currentRound: 1,
      choices: new Map(),
      scores: new Map(),
      finished: false
    };

    return context;
  }

  async onPlayerJoin(context, player) {
    const userId = player.id;

    if (!context.state.data.scores.has(userId)) {
      context.state.data.scores.set(userId, 0);
    }

    return {
      success: true,
      player
    };
  }

  async onStart(context) {
    const players = context.players || [];

    for (const player of players) {
      if (!context.state.data.scores.has(player.id)) {
        context.state.data.scores.set(player.id, 0);
      }
    }

    return {
      success: true,
      message:
        '🎮 بازی «سنگ کاغذ قیچی» شروع شد!\n\n' +
        'هر بازیکن یکی از این سه گزینه را انتخاب کند:\n' +
        '🪨 سنگ\n' +
        '📄 کاغذ\n' +
        '✂️ قیچی'
    };
  }

  async onAction(context, action) {
    const choiceMap = {
      rock: 'rock',
      paper: 'paper',
      scissors: 'scissors'
    };

    const choice = choiceMap[action];

    if (!choice) {
      return {
        handled: false,
        action
      };
    }

    if (context.state.data.finished) {
      return {
        handled: true,
        message: '🏁 این بازی تمام شده است.'
      };
    }

    const userId = context.userId;

    context.state.data.choices.set(userId, choice);

    return {
      handled: true,
      choice
    };
  }

  getWinner(choice1, choice2) {
    if (choice1 === choice2) {
      return 'draw';
    }

    if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'scissors' && choice2 === 'paper') ||
      (choice1 === 'paper' && choice2 === 'rock')
    ) {
      return 'first';
    }

    return 'second';
  }

  getChoiceName(choice) {
    const names = {
      rock: '🪨 سنگ',
      paper: '📄 کاغذ',
      scissors: '✂️ قیچی'
    };

    return names[choice] || '❔';
  }

  async onFinish(context, result = {}) {
    context.state.data.finished = true;

    return result;
  }
}

export default new RockPaperScissors();
