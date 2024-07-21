import { skills } from '@data/skills.js';
import { prisma } from '@database/prisma.js';

export default async function () {
  for (const skill of skills) {
    await prisma.skill.upsert({
      create: {
        name: skill.name,
        id: skill.id,
        skillCategoryId: skill.categoryId
      },
      update: {
        name: skill.name,
        skillCategory: {
          connect: {
            id: skill.categoryId
          }
        }
      },
      where: {
        id: skill.id
      }
    });
  }
}
