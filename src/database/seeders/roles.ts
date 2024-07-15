import { prisma } from '@database/prisma.js';

export default async function () {
  await prisma.role.upsert({
    create: {
      id: 1,
      name: 'Admin',
      description: 'The administrator role',
      permissions: {
        connect: {
          name: 'user.other.modify'
        }
      }
    },
    update: {
      permissions: {
        connect: {
          name: 'user.other.modify'
        }
      }
    },
    where: {
      name: 'Admin'
    }
  });

  await prisma.role.upsert({
    create: {
      id: 2,
      name: 'User',
      description: 'The user role'
    },
    update: {},
    where: {
      name: 'User'
    }
  });
}
