// CDOW bot - welcome messages & channel announcements only (site login is Steam).
const TelegramBot = require('node-telegram-bot-api');

function initBot(ctx) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) { console.log('[bot] TELEGRAM_BOT_TOKEN not set - bot disabled.'); return null; }
  const bot = new TelegramBot(token, { polling: true });
  const CHANNEL = process.env.TELEGRAM_CHANNEL_ID || '';
  const SITE = ctx.siteUrl;

  bot.onText(/\/start/, (msg) => {
    const text =
      'CDOW - CS2 CASES & DROP & OPEN & WIN\n\n' +
      'Open cases, battle players, and win real skins.\n\n' +
      'Login on the site with your Steam account.\n' +
      'Daily free coins, tasks and +5000 per invited friend.';
    bot.sendMessage(msg.chat.id, text, {
      reply_markup: { inline_keyboard: [[{ text: 'PLAY NOW', url: SITE }]] },
    });
  });

  bot.on('callback_query', (q) => bot.answerCallbackQuery(q.id));

  return {
    bot,
    announce: async (text) => {
      if (!CHANNEL) return;
      try { await bot.sendMessage(CHANNEL, text, { parse_mode: 'Markdown' }); }
      catch (e) { console.error('[bot] announce failed:', e.message); }
    },
  };
}

module.exports = { initBot };
