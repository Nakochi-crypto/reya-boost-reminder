import { Composer } from 'telegraf';
import { prisma } from '../lib/prisma';

export const remove = Composer.command('remove', async (ctx) => {
  const telegramChatId = ctx.message.chat.id;
  const [address] = ctx.text.match(/0x[a-f0-9]{40}/i) ?? [];

  if (!address) {
    await ctx.reply('Usage: /remove <address>');
    return;
  }

  await prisma.subscription.delete({
    where: {
      telegramChatId_address: { telegramChatId, address },
    },
  });

  await ctx.reply(`${address} removed`);

  await prisma.$disconnect();
});
