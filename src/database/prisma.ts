import { PrismaClient } from './prisma/generated/prisma-client-js/index.js';
import { config } from 'dotenv';

config({
  path: '.env'
});

const prisma = new PrismaClient({
  errorFormat: 'pretty'
});

export { prisma };
