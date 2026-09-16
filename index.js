import 'dotenv/config';
import { Telegraf } from 'telegraf';
import http from 'http';

import gameEngine from './core/engine.js';
import commandManager from './core/command-manager.js';
import gameRegistry from './core/game-registry.js';
import gameManager from './core/game-manager.js';
import middlewareManager from './core/middleware.js';
import gameEvents from './core/game-events.js';
import gameActions from './core/game-actions.js';
import gameTurn from './core/game-turn.js';
import gameTimer from './core/game-timer.js';
import gameScore from './core/game-score.js';
import gameLogger from './core/game-logger.js';
import responseManager from './core/response.js';
import errorHandler from './core/error-handler.js';
import commandParser from './core/command-parser.js';
import GameContext from './core/game-context.js';
import CommandContext from './core/command-context.js';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN پیدا نشد.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

console.log('================================');
console.log('🧠 Loading BaziGardaan Core...');
console.log('================================');

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

// پاسخ‌های طبیعی برای تست اولیه ربات
const botReplies = [
  'جانم؟ 😄',
  'بگو عزیز دل 😎',
  'هستم، چی شده؟ 😂',
  'چرا انقدر ربات ربات می‌کنی؟ 😂',
  'جان؟ صدای منو زدی؟ 😏',
  'بله قربان، بازی‌گردان حاضر است 🎮😂'
];

// Middleware پایه برای ساخت Context
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
        ctx.bazi.command =
          parsed.command;

        ctx.bazi.args =
          parsed.args;

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
      errorHandler.handle(error, {
        ctx
      });

      throw error;
    }
  },
  {
    name: 'core-context',
    priority: 100
  }
);

// تست طبیعی «ربات»
bot.hears(/^ربات$/i, async (ctx) => {
  const reply =
    botReplies[
      Math.floor(
        Math.random() *
        botReplies.length
      )
    ];

  await responseManager.send(
    ctx,
    responseManager.reply(reply)
  );
});

// /start
bot.start(async (ctx) => {
  await responseManager.send(
    ctx,
    responseManager.reply(
      '🎮 سلام! من بازی‌گردانم.\n\n' +
      'برای اجرای بازی‌ها و مدیریت بازی‌های گروهی ساخته شدم 😎\n\n' +
      'فعلاً در مرحله راه‌اندازی هستم...'
    )
  );
});

// اجرای Middleware اصلی
bot.use(async (ctx, next) => {
  try {
    await middlewareManager.run(ctx);
  } catch (error) {
    errorHandler.handle(error, {
      ctx
    });
  }

  await next();
});

// نمایش اطلاعات Core برای تست
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
    '✅ هسته با موفقیت فعال است.';
  
  await ctx.reply(text, {
    reply_parameters: {
      message_id:
        ctx.message.message_id
    }
  });
});

// تست Parser
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
    `Args: ${parsed.args.length ? parsed.args.join(' | ') : 'ندارد'}`,
    {
      reply_parameters: {
        message_id:
          ctx.message.message_id
      }
    }
  );
});

// خطای مرکزی ربات
bot.catch((err, ctx) => {
  console.error(
    '❌ Bot Error:',
    err
  );

  errorHandler.handle(err, {
    ctx
  });

  ctx.reply(
    '⚠️ یه مشکلی پیش اومد، دوباره امتحان کن.'
  ).catch(() => {});
});

// سرور Render
const PORT =
  process.env.PORT || 10000;

const server = http.createServer(
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

// راه‌اندازی ربات
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
      '🧠 Core Engine connected'
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

// خاموش شدن امن
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
