import { prisma } from '@database/prisma.js';

export default async function () {
  await prisma.permission.upsert({
    create: {
      name: 'user.other.modify',
      description: 'Permission to modify other user and release user'
    },
    update: {},
    where: {
      name: 'user.other.modify'
    },
    select: {
      id: true
    }
  });
}
