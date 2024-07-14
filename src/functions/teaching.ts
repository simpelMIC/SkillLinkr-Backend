import { prisma } from '../database/prisma.js';
import type { Return } from '../types/Return.js';
import { userHasPermission } from './helper/role.js';

async function getUserTeachingData({
  userId
}: {
  userId: string;
}): Promise<Return<Record<string, any> | string>> {
  const teachingData = await prisma.teachingInformation.findFirst({
    where: {
      userId
    },
    select: {
      id: true,
      teachesInPerson: true,
      teachesOnline: true,
      teachingCity: true,
      teachingCountry: true,
      createdAt: true,
      updatedAt: true,
      userId: true
    }
  });

  if (teachingData === null) {
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
      message: {
        id: teachingData.id,
        userId: teachingData.userId,
        teachesInPerson: teachingData.teachesInPerson,
        teachesOnline: teachingData.teachesOnline,
        teachingCity: teachingData.teachingCity,
        teachingCountry: teachingData.teachingCountry,
        updatedAt: teachingData.updatedAt,
        createdAt: teachingData.createdAt
      }
    }
  };
}

async function patchUserTeaching({
  requestUserId,
  patchUserId,
  teachesOnline,
  teachesInPerson,
  teachingCity,
  teachingCountry
}: {
  requestUserId: string;
  patchUserId: string;
  teachesOnline: boolean | undefined;
  teachesInPerson: boolean | undefined;
  teachingCity: string | undefined | null;
  teachingCountry: string | undefined | null;
}): Promise<Return<string>> {
  const requestUser = await prisma.user.findFirst({
    where: {
      id: requestUserId
    },
    select: {
      id: true,
      role: true
    }
  });

  if (requestUser === null) {
    return {
      status: 'error',
      statusCode: 401,
      send: {
        status: 'error',
        message: "User doesn't exist."
      }
    };
  }

  const userCanModifyOtherUser = await userHasPermission({
    userId: requestUser.id,
    permissionName: 'user.other.modify'
  });

  if (!userCanModifyOtherUser && patchUserId !== requestUserId) {
    return {
      status: 'unauthorized',
      statusCode: 401,
      send: {
        status: 'unauthorized',
        message: 'You are not allowed to update an other user'
      }
    };
  }

  const update = await prisma.teachingInformation.update({
    where: {
      userId: patchUserId
    },
    data: {
      teachesOnline,
      teachesInPerson,
      teachingCity,
      teachingCountry
    }
  });

  if (!update) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: 'Updating the teaching information failed'
      }
    };
  }

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: 'Teaching information updated'
    }
  };
}

export { getUserTeachingData, patchUserTeaching };
