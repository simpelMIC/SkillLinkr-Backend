import { prisma } from '../database/prisma.js';
import type { Return } from '../types/Return.js';
import { userHasPermission } from './helper/role.js';

async function getUserSocialMediaData({
  userId
}: {
  userId: string;
}): Promise<Return<Record<string, any> | string>> {
  const socialMediaData = await prisma.socialMedia.findFirst({
    where: {
      userId
    },
    select: {
      id: true,
      discordName: true,
      createdAt: true,
      facebookName: true,
      instagramName: true,
      updatedAt: true,
      userId: true,
      xName: true
    }
  });

  if (socialMediaData === null) {
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
        id: socialMediaData.id,
        userId: socialMediaData.userId,
        discordName: socialMediaData.discordName,
        facebookName: socialMediaData.facebookName,
        instagramName: socialMediaData.instagramName,
        xName: socialMediaData.xName,
        updatedAt: socialMediaData.updatedAt,
        createdAt: socialMediaData.createdAt
      }
    }
  };
}

async function patchUserSocialMedia({
  requestUserId,
  patchUserId,
  xName,
  instagramName,
  discordName,
  facebookName
}: {
  requestUserId: string;
  patchUserId: string;
  xName: string | undefined | null;
  instagramName: string | undefined | null;
  discordName: string | undefined | null;
  facebookName: string | undefined | null;
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

  const update = await prisma.socialMedia.update({
    where: {
      userId: patchUserId
    },
    data: {
      discordName,
      facebookName,
      instagramName,
      xName
    }
  });

  if (!update) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: 'Updating the social media information failed'
      }
    };
  }

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: 'Social media information updated'
    }
  };
}

export { getUserSocialMediaData, patchUserSocialMedia };
