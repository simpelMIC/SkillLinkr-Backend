import { prisma } from '@database/prisma.js';
import type { Return } from '../../types/Return.js';

async function getSkillCategories(): Promise<
  Return<Record<string, any>[] | string>
> {
  const skillCategoryData = await prisma.skillCategory.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (skillCategoryData === null) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: "Requested data doesn't exist"
      }
    };
  }

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: skillCategoryData
    }
  };
}

async function getSkillCategory({
  id
}: {
  id: number;
}): Promise<Return<Record<string, any> | string>> {
  const skillCategoryData = await prisma.skillCategory.findFirst({
    where: {
      id
    },
    select: {
      id: true,
      createdAt: true,
      name: true,
      updatedAt: true
    }
  });

  if (skillCategoryData === null) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: "Requested data doesn't exist"
      }
    };
  }

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: skillCategoryData
    }
  };
}

export { getSkillCategories, getSkillCategory };
