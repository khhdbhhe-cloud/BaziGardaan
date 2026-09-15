import 'dotenv/config';
import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN پیدا نشد.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// پاسخ‌های طبیعی برای تست اولیه ربات
const botReplies = [
  'جانم؟ 😄',
  'بگو عزیز دل 😎',
  'هستم، چی شده؟ 😂',
  'چرا انقدر ربات ربات می‌کنی؟ 😂',
  'جان؟ صدای منو زدی؟ 😏',
  'بله قربان، بازی‌گردان حاضر است 🎮😂'
];

// تست اولیه: وقتی کسی فقط «ربات» می‌نویسد
bot.hears(/^ربات$/i, async (ctx) => {
  const reply =
    botReplies[Math.floor(Math.random() * botReplies.length)];

  await ctx.reply(reply, {
    reply_parameters: {
      message_id: ctx.message.message_id
    }
  });
});

// دستور شروع
bot.start(async (ctx) => {
  await ctx.reply(
    '🎮 سلام! من بازی‌گردانم.\n\n' +
    'برای اجرای بازی‌ها و مدیریت بازی‌های گروهی ساخته شدم 😎\n\n' +
    'فعلاً در مرحله راه‌اندازی هستم...'
  );
});

// مدیریت خطا
bot.catch((err, ctx) => {
  console.error('❌ Bot Error:', err);

  try {
    ctx.reply('⚠️ یه مشکلی پیش اومد، دوباره امتحان کن.');
  } catch {
    // جلوگیری از خطای دوم
  }
});

// راه‌اندازی ربات
bot.launch()
  .then(() => {
    console.log('================================');
    console.log('🎮 BaziGardaan ONLINE');
    console.log('🤖 Bot is running successfully');
    console.log('================================');
  })
  .catch((err) => {
    console.error('❌ Failed to start bot:', err);
    process.exit(1);
  });

// خاموش شدن صحیح برنامه
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
