import BaseGame from '../../core/game.js';

class RockPaperScissors extends BaseGame {
  constructor() {
    super({
      name: 'rock-paper-scissors',
      displayName: 'سنگ کاغذ قیچی',
      minPlayers: 2,
      maxPlayers: 10,
    });
  }

  async onCreate(ctx) {
    ctx.state = {
      choices: {},
      finished: false,
    };
  }

  async onStart(ctx) {
    ctx.state.choices = {};
    ctx.state.finished = false;
  }

  async onPlayerJoin(ctx) {
    // بازیکن وارد بازی شد
  }

  async onPlayerLeave(ctx) {
    // بازیکن از بازی خارج شد
  }

  async onStop(ctx) {
    ctx.state.finished = true;
  }

  async onFinish(ctx) {
    ctx.state.finished = true;
  }

  setChoice(ctx, playerId, choice) {
    if (ctx.state.finished) return false;

    const validChoices = ['rock', 'paper', 'scissors'];

    if (!validChoices.includes(choice)) {
      return false;
    }

    ctx.state.choices[playerId] = choice;

    return true;
  }

  getChoice(ctx, playerId) {
    return ctx.state.choices[playerId] || null;
  }

  getResult(choice1, choice2) {
    if (choice1 === choice2) {
      return 'draw';
    }

    if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'paper' && choice2 === 'rock') ||
      (choice1 === 'scissors' && choice2 === 'paper')
    ) {
      return 'player1';
    }

    return 'player2';
  }
}

export default new RockPaperScissors();
