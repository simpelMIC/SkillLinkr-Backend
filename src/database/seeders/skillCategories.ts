import { categories } from '@data/skillCategories.js';
import { prisma } from '@database/prisma.js';

export default async function () {
  for (const category of categories) {
    await prisma.skillCategory.upsert({
      create: {
        name: category.name,
        id: category.id
      },
      update: {
        name: category.name
      },
      where: {
        id: category.id
      }
    });
  }
}
