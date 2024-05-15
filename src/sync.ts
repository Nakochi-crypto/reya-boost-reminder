import { fetchExpiration } from './lib/api';
import { prisma } from './lib/prisma';

async function sync() {
  const target = await prisma.subscription.findFirst({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
    orderBy: {
      updatedAt: 'asc',
    },
  });

  if (!target) {
    return;
  }

  console.log(target);

  const { telegramChatId, address } = target;

  const response = await fetchExpiration(address);

  await prisma.subscription.update({
    where: {
      telegramChatId_address: { telegramChatId, address },
    },
    data: {
      expiresAt: new Date(response.nextBoostStartTimestampMilliseconds),
    },
  });
  console.log('subscription updated');
}

sync().catch(async (e) => {
  console.error(e);
  process.exitCode = 1;
  await prisma.$disconnect();
});
