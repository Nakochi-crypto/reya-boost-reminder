import { Composer } from 'telegraf';
import { prisma } from '../lib/prisma.js';

export const chatMemberLeft = Composer.on(
  'my_chat_member',
  async (ctx, next) => {
    console.log(ctx.update.my_chat_member);

    const { status } = ctx.update.my_chat_member.new_chat_member;

    if (status === 'left' || status === 'kicked' || status === 'restricted') {
      await prisma.subscription.deleteMany({
        where: {
          telegramChatId: ctx.update.my_chat_member.chat.id,
        },
      });
    }

    return next();
  },
);
