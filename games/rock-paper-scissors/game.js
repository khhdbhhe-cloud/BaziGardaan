import BaseGame from '../../core/game.js';

class RockPaperScissors extends BaseGame {
  constructor() {
    super({
      name: 'rock-paper-scissors',
      displayName: 'سنگ کاغذ قیچی',
      minPlayers: 2,
      maxPlayers: 10
    });
  }

  async onCreate(ctx) {
    ctx.state.data = {
      choices: new Map(),
      scores: new Map(),
      currentRound: 1,
      finished: false
    };
  }

  async onStart(ctx) {
    ctx.state.data.choices.clear();
    ctx.state.data.currentRound = 1;
    ctx.state.data.finished = false;
  }

  async onAction(ctx, choice) {
    if (ctx.state.data.finished) {
      return false;
    }

    const validChoices = [
      'rock',
      'paper',
      'scissors'
    ];

    if (!validChoices.includes(choice)) {
      return false;
    }

    ctx.state.data.choices.set(
      ctx.userId,
      choice
    );

    return true;
  }

  getChoiceName(choice) {
    const names = {
      rock: '🪨 سنگ',
      paper: '📄 کاغذ',
      scissors: '✂️ قیچی'
    };

    return names[choice] || 'نامشخص';
  }

  getWinner(firstChoice, secondChoice) {
    if (
      firstChoice === secondChoice
    ) {
      return 'draw';
    }

    if (
      (firstChoice === 'rock' &&
        secondChoice === 'scissors') ||
      (firstChoice === 'paper' &&
        secondChoice === 'rock') ||
      (firstChoice === 'scissors' &&
        secondChoice === 'paper')
    ) {
      return 'first';
    }

    return 'second';
  }

  async onStop(ctx) {
    ctx.state.data.finished = true;
  }

  async onFinish(ctx) {
    ctx.state.data.finished = true;
  }
}

export default new RockPaperScissors();
