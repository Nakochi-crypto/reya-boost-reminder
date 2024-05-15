import { fetchExpiration } from './lib/api.js';
import { bot } from './lib/bot.js';
import { prisma } from './lib/prisma.js';

async function notify() {
  const target = await prisma.subscription.findFirst({
    where: {
      expiresAt: {
        lt: new Date(),
        gt: prisma.subscription.fields.notifiedAt,
      },
    },
    orderBy: {
      expiresAt: 'asc',
    },
  });

  if (!target) {
    return;
  }

  console.log(target);

  const { telegramChatId, address } = target;

  const response = await fetchExpiration(address);

  if (response.status === 'expired') {
    await bot.telegram.sendMessage(
      Number(telegramChatId),
      `
Boost expired
${address}
https://reya.network/lge
`,
    );
    console.log('Notification sent');
  }

  await prisma.subscription.update({
    where: {
      telegramChatId_address: { telegramChatId, address },
    },
    data: {
      notifiedAt: new Date(),
    },
  });
  console.log('Subscription updated');
}

notify().catch(async (e) => {
  console.error(e);
  process.exitCode = 1;
  await prisma.$disconnect();
});
