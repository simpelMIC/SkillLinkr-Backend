import { prisma } from '@database/prisma.js';
import type { Return } from '../../types/Return.js';

async function getSkills({
  skillCategoryId
}: {
  skillCategoryId: number;
}): Promise<Return<Record<string, any>[] | string>> {
  const skillData = await prisma.skill.findMany({
    where: {
      skillCategoryId
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      skillCategoryId: true
    }
  });

  if (skillData === null || skillData.length === 0) {
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
      message: skillData
    }
  };
}

async function getSkill({
  id
}: {
  id: number;
}): Promise<Return<Record<string, any> | string>> {
  const skillData = await prisma.skill.findFirst({
    where: {
      id
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      skillCategoryId: true
    }
  });

  if (skillData === null) {
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
      message: skillData
    }
  };
}

async function getSkillTeacher({
  id
}: {
  id: number;
}): Promise<Return<Record<string, any> | string>> {
  const skillData = await prisma.skill.findFirst({
    where: {
      id
    },
    select: {
      id: true,
      userWhoTeach: true
    }
  });

  if (skillData === null) {
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
      message: skillData
    }
  };
}

export { getSkills, getSkill, getSkillTeacher };
