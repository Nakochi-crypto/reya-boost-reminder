import { Composer } from 'telegraf';
import { fetchExpiration } from '../lib/api.js';
import { prisma } from '../lib/prisma.js';

export const add = Composer.command('add', async (ctx) => {
  const telegramChatId = ctx.message.chat.id;
  const [address] = ctx.text.match(/0x[a-f0-9]{40}/i) ?? [];

  if (!address) {
    await ctx.reply('Usage: /add 0x...');
    return;
  }

  const exists = await prisma.subscription.findUnique({
    where: {
      telegramChatId_address: { telegramChatId, address },
    },
  });

  if (exists) {
    await ctx.reply('Already added');
    return;
  }

  const response = await fetchExpiration(address);

  console.log(response);

  if (response.status === 'notStarted') {
    await ctx.reply('Not started');
    return;
  }

  await prisma.subscription.create({
    data: {
      telegramChatId,
      address,
      expiresAt: new Date(response.nextBoostStartTimestampMilliseconds),
      notifiedAt: new Date(0),
    },
  });

  await ctx.reply(`${address} added`);

  await prisma.$disconnect();
});
