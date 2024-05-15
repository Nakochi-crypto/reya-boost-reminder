import { bot } from './lib/bot.js';
import { prisma } from './lib/prisma.js';
import { chatMemberLeft } from './middleware/chatMemberLeft.js';
import { add } from './middleware/add.js';
import { remove } from './middleware/remove.js';

bot.on('message', (ctx, next) => {
  console.log(ctx.message);
  return next();
});

bot.use(chatMemberLeft);
bot.use(add);
bot.use(remove);

bot.start(async (ctx) => {
  await ctx.reply(`
Usage:

/add <address>
/remove <address>
`);
});

bot.catch(async (e, ctx) => {
  await ctx.reply('Error');
  await prisma.$disconnect();
  console.error(e);
});

bot.launch({
  allowedUpdates: ['message', 'my_chat_member'],
  dropPendingUpdates: true,
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
