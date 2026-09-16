import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import http from 'http';

import gameRegistry from './core/game-registry.js';
import gameManager from './core/game-manager.js';
import commandManager from './core/command-manager.js';
import middlewareManager from './core/middleware.js';
import gameEvents from './core/game-events.js';
import gameActions from './core/game-actions.js';
import gameTimer from './core/game-timer.js';
import gameScore from './core/game-score.js';
import responseManager from './core/response.js';
import errorHandler from './core/error-handler.js';
import commandParser from './core/command-parser.js';
import GameContext from './core/game-context.js';
import CommandContext from './core/command-context.js';

import rockPaperScissors from './games/rock-paper-scissors/game.js';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN پیدا نشد.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

console.log('================================');
console.log('🧠 Loading BaziGardaan Core...');
console.log('================================');

/* =========================
   ثبت بازی‌ها
========================= */

try {
  gameManager.registerGame(rockPaperScissors);

  console.log(
    `🎮 Registered games: ${gameRegistry.getCount()}`
  );
} catch (error) {
  console.error('❌ Game registration failed:', error);
  process.exit(1);
}

/* =========================
   اطلاعات Core
========================= */

console.log(
  `🎮 Games: ${gameRegistry.getCount()}`
);

console.log(
  `⌨️ Commands: ${commandManager.count()}`
);

console.log(
  `🛡️ Middlewares: ${middlewareManager.count()}`
);

console.log(
  `🎯 Actions: ${gameActions.count()}`
);

console.log('================================');
console.log('🧠 BaziGardaan Core Loaded');
console.log('================================');

/* =========================
   پاسخ‌های تست
========================= */

const botReplies = [
  'جانم؟ 😄',
  'بگو عزیز دل 😎',
  'هستم، چی شده؟ 😂',
  'جان؟ صدای منو زدی؟ 😏',
  'بله قربان، بازی‌گردان حاضر است 🎮'
];

/* =========================
   ابزارهای کمکی
========================= */

function getPlayerName(player) {
  return (
    player?.first_name ||
    player?.username ||
    'بازیکن'
  );
}

function isCreator(session, userId) {
  return (
    Number(session?.data?.creatorId) ===
    Number(userId)
  );
}

function getRpsKeyboard(chatId) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '🪨 سنگ',
        `rps:rock:${chatId}`
      ),
      Markup.button.callback(
        '📄 کاغذ',
        `rps:paper:${chatId}`
      ),
      Markup.button.callback(
        '✂️ قیچی',
        `rps:scissors:${chatId}`
      )
    ]
  ]);
}

function getWaitingKeyboard(chatId) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '➕ ورود به بازی',
        `rps:join:${chatId}`
      )
    ],
    [
      Markup.button.callback(
        '▶️ شروع',
        `rps:start:${chatId}`
      ),
      Markup.button.callback(
        '🛑 لغو',
        `rps:stop:${chatId}`
      )
    ]
  ]);
}

/* =========================
   Middleware Context
========================= */

middlewareManager.use(
  async (ctx, next) => {
    try {
      ctx.bazi = {
        command: null,
        args: [],
        commandContext: null,
        gameContext: null
      };

      const text =
        ctx.message?.text || '';

      const parsed =
        commandParser.parse(text);

      if (parsed) {
        ctx.bazi.command = parsed.command;
        ctx.bazi.args = parsed.args;

        ctx.bazi.commandContext =
          new CommandContext({
            ctx,
            command: parsed.command,
            args: parsed.args,
            text
          });
      }

      const chatId =
        ctx.chat?.id ?? null;

      const session =
        chatId !== null
          ? gameManager.getSession(chatId)
          : null;

      if (session) {
        const state =
          gameManager.getState(chatId);

        const game =
          gameManager.getGame(
            session.gameName
          );

        const players =
          gameManager.getPlayers(chatId);

        ctx.bazi.gameContext =
          new GameContext({
            ctx,
            session,
            state,
            game,
            players
          });
      }

      await next();
    } catch (error) {
      errorHandler.handle(error, { ctx });
      throw error;
    }
  },
  {
    name: 'core-context',
    priority: 100
  }
);

/* =========================
   ربات
========================= */

bot.hears(/^ربات$/i, async (ctx) => {
  const reply =
    botReplies[
      Math.floor(
        Math.random() * botReplies.length
      )
    ];

  await responseManager.send(
    ctx,
    responseManager.reply(reply)
  );
});

/* =========================
   START
========================= */

bot.start(async (ctx) => {
  await ctx.reply(
    '🎮 سلام! من بازی‌گردانم.\n\n' +
    'برای شروع بازی در گروه بنویس:\n' +
    '🎲 بازی\n\n' +
    'بازی‌های موجود:\n' +
    '🪨 سنگ کاغذ قیچی'
  );
});

/* =========================
   اجرای Middleware
========================= */

bot.use(async (ctx, next) => {
  try {
    await middlewareManager.run(ctx);
  } catch (error) {
    errorHandler.handle(error, { ctx });
  }

  await next();
});

/* =========================
   نمایش بازی‌ها
========================= */

bot.hears(/^بازی‌ها$/i, async (ctx) => {
  const games = gameRegistry.list();

  if (!games.length) {
    return ctx.reply(
      '🎮 هنوز بازی‌ای ثبت نشده است.'
    );
  }

  const lines = games.map(
    (game, index) =>
      `${index + 1}. 🎮 ${game.displayName}`
  );

  await ctx.reply(
    '🎮 بازی‌های موجود:\n\n' +
    lines.join('\n') +
    '\n\nبرای شروع:\n' +
    '🎲 بازی'
  );
});

/* =========================
   ساخت بازی
========================= */

bot.hears(/^بازی$/i, async (ctx) => {
  const chatId = ctx.chat.id;
  const creatorId = ctx.from.id;

  try {
    if (gameManager.getSession(chatId)) {
      return ctx.reply(
        '⚠️ در این گروه یک بازی در حال اجرا یا انتظار است.'
      );
    }

    const session =
      gameManager.createGame(
        chatId,
        'rock-paper-scissors'
      );

    /*
     * شناسه سازنده بازی
     * برای کنترل دکمه‌های شروع و لغو
     */
    session.data = session.data || {};
    session.data.creatorId = creatorId;

    gameManager.addPlayer(
      chatId,
      ctx.from
    );

    await ctx.reply(
      '🎮 『 سنگ کاغذ قیچی 』\n\n' +
      'بازی ساخته شد!\n\n' +
      `👤 سازنده: ${getPlayerName(ctx.from)}\n` +
      '👥 بازیکن فعلی: 1 نفر\n\n' +
      'برای ورود روی «➕ ورود به بازی» بزنید.\n\n' +
      'حداقل بازیکن برای شروع: 2 نفر',
      getWaitingKeyboard(chatId)
    );

    return session;
  } catch (error) {
    console.error(
      '❌ Create game error:',
      error
    );

    await ctx.reply(
      '⚠️ ساخت بازی انجام نشد.'
    );
  }
});

/* =========================
   انتخاب سنگ / کاغذ / قیچی
========================= */

bot.action(
  /^rps:(rock|paper|scissors):(-?\d+)$/,
  async (ctx) => {
    const choice = ctx.match[1];
    const chatId = Number(ctx.match[2]);

    if (ctx.chat?.id !== chatId) {
      return ctx.answerCbQuery(
        'این دکمه مربوط به این گروه نیست.',
        { show_alert: true }
      );
    }

    const session =
      gameManager.getSession(chatId);

    if (!session) {
      return ctx.answerCbQuery(
        'این بازی دیگر فعال نیست.',
        { show_alert: true }
      );
    }

    if (session.state !== 'running') {
      return ctx.answerCbQuery(
        'بازی هنوز شروع نشده است.',
        { show_alert: true }
      );
    }

    const players =
      gameManager.getPlayers(chatId);

    const player =
      players.find(
        item =>
          Number(item.id) ===
          Number(ctx.from.id)
      );

    if (!player) {
      return ctx.answerCbQuery(
        'اول وارد بازی شو.',
        { show_alert: true }
      );
    }

    const state =
      gameManager.getState(chatId);

    const game =
      gameManager.getGame(
        'rock-paper-scissors'
      );

    const context = {
      ctx,
      chatId,
      userId: ctx.from.id,
      session,
      state,
      game,
      players
    };

    try {
      await game.onAction(
        context,
        choice
      );
    } catch (error) {
      console.error(
        '❌ RPS action error:',
        error
      );

      return ctx.answerCbQuery(
        'ثبت انتخاب انجام نشد.',
        { show_alert: true }
      );
    }

    await ctx.answerCbQuery(
      `انتخابت ثبت شد: ${game.getChoiceName(choice)}`
    );

    const choices =
      state.data.choices;

    if (choices.size < players.length) {
      return;
    }

    const entries =
      Array.from(choices.entries());

    if (entries.length < 2) {
      return;
    }

    const [
      [firstId, firstChoice],
      [secondId, secondChoice]
    ] = entries;

    const roundWinner =
      game.getWinner(
        firstChoice,
        secondChoice
      );

    const scores =
      state.data.scores;

    if (roundWinner === 'first') {
      scores.set(
        firstId,
        (scores.get(firstId) || 0) + 1
      );
    }

    if (roundWinner === 'second') {
      scores.set(
        secondId,
        (scores.get(secondId) || 0) + 1
      );
    }

    const firstPlayer =
      players.find(
        p =>
          Number(p.id) ===
          Number(firstId)
      );

    const secondPlayer =
      players.find(
        p =>
          Number(p.id) ===
          Number(secondId)
      );

    const firstName =
      getPlayerName(firstPlayer);

    const secondName =
      getPlayerName(secondPlayer);

    let resultText =
      '🎮 نتیجه راند\n\n' +
      `👤 ${firstName}: ${game.getChoiceName(firstChoice)}\n` +
      `👤 ${secondName}: ${game.getChoiceName(secondChoice)}\n\n`;

    if (roundWinner === 'draw') {
      resultText +=
        '🤝 مساوی شد!';
    } else if (roundWinner === 'first') {
      resultText +=
        `🏆 برنده این راند: ${firstName}`;
    } else {
      resultText +=
        `🏆 برنده این راند: ${secondName}`;
    }

    const firstScore =
      scores.get(firstId) || 0;

    const secondScore =
      scores.get(secondId) || 0;

    resultText +=
      '\n\n📊 امتیاز:\n' +
      `${firstName}: ${firstScore}\n` +
      `${secondName}: ${secondScore}`;

    if (
      firstScore >= 2 ||
      secondScore >= 2
    ) {
      state.data.finished = true;

      const winner =
        firstScore > secondScore
          ? firstName
          : secondName;

      resultText +=
        `\n\n🏆 برنده نهایی: ${winner}\n` +
        '🎉 بازی به پایان رسید!';

      try {
        await ctx.editMessageText(
          resultText
        );
      } catch (error) {
        console.error(
          '❌ Edit result error:',
          error
        );
      }

      await gameManager.finishGame(
        chatId,
        {
          winner,
          scores: {
            [firstId]: firstScore,
            [secondId]: secondScore
          }
        }
      );

      return;
    }

    state.data.currentRound += 1;
    state.data.choices.clear();

    try {
      await ctx.editMessageText(
        resultText +
        '\n\n🔄 راند بعدی شروع شد!\n' +
        'انتخاب خود را بزنید:',
        getRpsKeyboard(chatId)
      );
    } catch (error) {
      console.error(
        '❌ Edit next round error:',
        error
      );
    }
  }
);

/* =========================
   ورود بازیکن
========================= */

bot.action(
  /^rps:join:(-?\d+)$/,
  async (ctx) => {
    const chatId =
      Number(ctx.match[1]);

    if (ctx.chat?.id !== chatId) {
      return ctx.answerCbQuery(
        'این دکمه مربوط به این گروه نیست.',
        { show_alert: true }
      );
    }

    const session =
      gameManager.getSession(chatId);

    if (!session) {
      return ctx.answerCbQuery(
        'بازی پیدا نشد.',
        { show_alert: true }
      );
    }

    if (session.state !== 'waiting') {
      return ctx.answerCbQuery(
        'بازی شروع شده است.',
        { show_alert: true }
      );
    }

    const players =
      gameManager.getPlayers(chatId);

    const exists =
      players.some(
        player =>
          Number(player.id) ===
          Number(ctx.from.id)
      );

    if (exists) {
      return ctx.answerCbQuery(
        'تو قبلاً وارد بازی شدی.'
      );
    }

    const added =
      gameManager.addPlayer(
        chatId,
        ctx.from
      );

    if (!added) {
      return ctx.answerCbQuery(
        'ظرفیت بازی تکمیل است.',
        { show_alert: true }
      );
    }

    const count =
      gameManager.getPlayers(chatId).length;

    await ctx.answerCbQuery(
      'با موفقیت وارد بازی شدی 🎮'
    );

    await ctx.reply(
      `➕ ${getPlayerName(ctx.from)} وارد بازی شد.\n\n` +
      `👥 تعداد بازیکنان: ${count}\n` +
      'وقتی حداقل ۲ نفر شدند، سازنده بازی می‌تواند آن را شروع کند.'
    );
  }
);

/* =========================
   شروع واقعی بازی
========================= */

bot.action(
  /^rps:start:(-?\d+)$/,
  async (ctx) => {
    const chatId =
      Number(ctx.match[1]);

    const session =
      gameManager.getSession(chatId);

    if (!session) {
      return ctx.answerCbQuery(
        'بازی وجود ندارد.',
        { show_alert: true }
      );
    }

    /*
     * فقط سازنده بازی اجازه شروع دارد
     */
    if (
      !isCreator(
        session,
        ctx.from.id
      )
    ) {
      return ctx.answerCbQuery(
        'فقط سازنده بازی می‌تواند بازی را شروع کند.',
        { show_alert: true }
      );
    }

    if (session.state !== 'waiting') {
      return ctx.answerCbQuery(
        'بازی قبلاً شروع شده.',
        { show_alert: true }
      );
    }

    const players =
      gameManager.getPlayers(chatId);

    if (players.length < 2) {
      return ctx.answerCbQuery(
        'برای شروع حداقل ۲ بازیکن لازم است.',
        { show_alert: true }
      );
    }

    try {
      await gameManager.startGame(
        chatId
      );
    } catch (error) {
      console.error(
        '❌ Start game error:',
        error
      );

      return ctx.answerCbQuery(
        'شروع بازی انجام نشد.',
        { show_alert: true }
      );
    }

    await ctx.answerCbQuery(
      'بازی شروع شد 🎮'
    );

    await ctx.editMessageText(
      '🎮 『 سنگ کاغذ قیچی 』\n\n' +
      '🔥 بازی شروع شد!\n\n' +
      'هر بازیکن انتخاب خود را بزند:',
      getRpsKeyboard(chatId)
    );
  }
);

/* =========================
   لغو بازی
========================= */

bot.action(
  /^rps:stop:(-?\d+)$/,
  async (ctx) => {
    const chatId =
      Number(ctx.match[1]);

    const session =
      gameManager.getSession(chatId);

    if (!session) {
      return ctx.answerCbQuery(
        'بازی فعالی وجود ندارد.'
      );
    }

    /*
     * فقط سازنده بازی اجازه لغو دارد
     */
    if (
      !isCreator(
        session,
        ctx.from.id
      )
    ) {
      return ctx.answerCbQuery(
        'فقط سازنده بازی می‌تواند بازی را لغو کند.',
        { show_alert: true }
      );
    }

    try {
      await gameManager.stopGame(
        chatId
      );
    } catch (error) {
      console.error(
        '❌ Stop game error:',
        error
      );

      return ctx.answerCbQuery(
        'لغو بازی انجام نشد.',
        { show_alert: true }
      );
    }

    await ctx.answerCbQuery(
      'بازی لغو شد.'
    );

    try {
      await ctx.editMessageText(
        '🛑 بازی توسط سازنده لغو شد.'
      );
    } catch (error) {
      console.error(
        '❌ Edit stop message error:',
        error
      );
    }
  }
);

/* =========================
   Core
========================= */

bot.command('core', async (ctx) => {
  const text =
    '🧠 BaziGardaan Core\n\n' +
    `🎮 بازی‌ها: ${gameRegistry.getCount()}\n` +
    `⌨️ دستورات: ${commandManager.count()}\n` +
    `🎯 اکشن‌ها: ${gameActions.count()}\n` +
    `🛡️ Middleware: ${middlewareManager.count()}\n` +
    `⏳ تایمرها: ${gameTimer.count()}\n` +
    `🏆 Score Boards: ${gameScore.scores.size}\n` +
    `📡 Game Events: ${gameEvents.list().length}\n\n` +
    '✅ هسته فعال است.';

  await ctx.reply(
    text,
    {
      reply_parameters: {
        message_id:
          ctx.message.message_id
      }
    }
  );
});

/* =========================
   Parser
========================= */

bot.command('parse', async (ctx) => {
  const parsed =
    commandParser.parse(
      ctx.message.text
    );

  if (!parsed) {
    return;
  }

  await ctx.reply(
    '🔎 Parser Result\n\n' +
    `Command: ${parsed.command}\n` +
    `Args: ${
      parsed.args.length
        ? parsed.args.join(' | ')
        : 'ندارد'
    }`,
    {
      reply_parameters: {
        message_id:
          ctx.message.message_id
      }
    }
  );
});

/* =========================
   خطای مرکزی
========================= */

bot.catch((err, ctx) => {
  console.error(
    '❌ Bot Error:',
    err
  );

  try {
    errorHandler.handle(
      err,
      { ctx }
    );
  } catch (error) {
    console.error(
      '❌ Error handler failed:',
      error
    );
  }

  ctx.reply(
    '⚠️ یه مشکلی پیش اومد، دوباره امتحان کن.'
  ).catch(() => {});
});

/* =========================
   Render
========================= */

const PORT =
  process.env.PORT || 10000;

const server =
  http.createServer(
    (req, res) => {
      res.writeHead(
        200,
        {
          'Content-Type':
            'text/plain; charset=utf-8'
        }
      );

      res.end(
        'BaziGardaan ONLINE'
      );
    }
  );

server.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `🌐 HTTP server running on port ${PORT}`
    );
  }
);

/* =========================
   Launch
========================= */

bot.launch()
  .then(() => {
    console.log(
      '================================'
    );

    console.log(
      '🎮 BaziGardaan ONLINE'
    );

    console.log(
      '🤖 Bot is running successfully'
    );

    console.log(
      `🎮 Games registered: ${gameRegistry.getCount()}`
    );

    console.log(
      '================================'
    );
  })
  .catch((err) => {
    console.error(
      '❌ Failed to start bot:',
      err
    );

    process.exit(1);
  });

/* =========================
   Shutdown
========================= */

process.once(
  'SIGINT',
  () => {
    console.log(
      '🛑 SIGINT received.'
    );

    gameTimer.clear();
    gameEvents.clear();
    gameActions.clear();

    bot.stop('SIGINT');
    server.close();
  }
);

process.once(
  'SIGTERM',
  () => {
    console.log(
      '🛑 SIGTERM received.'
    );

    gameTimer.clear();
    gameEvents.clear();
    gameActions.clear();

    bot.stop('SIGTERM');
    server.close();
  }
);
