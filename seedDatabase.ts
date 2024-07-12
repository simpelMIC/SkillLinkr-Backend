import { config } from 'dotenv';
config({
  path: './.env'
});
import { prisma } from './src/database/prisma.js';

const modifyUserPermission = await prisma.permission.upsert({
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

// ! Hardcoded id's to make sure, default role assignment works
await prisma.role.upsert({
  create: {
    id: 1,
    name: 'Admin',
    description: 'The administrator role',
    permissions: {
      connect: {
        id: modifyUserPermission.id
      }
    }
  },
  update: {
    permissions: {
      connect: {
        id: modifyUserPermission.id
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

console.log('Database seeded');
