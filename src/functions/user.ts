import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@database/prisma.js';
import type { Return } from '../types/Return.js';
import { userHasPermission } from '@functions/helper/role.js';
import { skillExists } from '@functions/helper/skill.js';

async function signup({
  mail,
  firstname,
  lastname,
  password
}: {
  mail: string;
  firstname: string;
  lastname: string;
  password: string;
}): Promise<Return<string | { token: string }>> {
  if (
    (
      await prisma.user.findMany({
        where: {
          mail
        }
      })
    ).length > 0
  ) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: 'An user with this mail address already exists'
      }
    };
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      firstname,
      lastname,
      mail,
      password: hashedPassword,
      roleId: 2 // User role
    },
    select: {
      id: true
    }
  });

  await prisma.teachingInformation.create({
    data: {
      userId: user.id
    }
  });

  await prisma.socialMedia.create({
    data: {
      userId: user.id
    }
  });

  const token = signToken(user.id);

  return {
    status: 'success',
    statusCode: 201,
    send: {
      status: 'success',
      message: {
        token
      }
    }
  };
}

function signToken(id: string): string {
  return jwt.sign(
    {
      id: id
    },
    process.env.API_SECRET as string,
    {
      expiresIn: '90 days'
    }
  );
}

async function login({
  mail,
  password
}: {
  mail: string;
  password: string;
}): Promise<Return<string | { token: string }>> {
  const user = await prisma.user.findFirst({
    where: { mail },
    select: {
      id: true,
      password: true
    }
  });

  if (user === null) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: "A user with this E-Mail doesn't exist"
      }
    };
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: 'Invalid password'
      }
    };
  }

  const token = signToken(user.id);

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: {
        token
      }
    }
  };
}

async function getUserData({
  id
}: {
  id: string;
}): Promise<Return<Record<string, any> | string>> {
  const user = await prisma.user.findFirst({
    where: {
      id
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      mail: true,
      released: true,
      role: true,
      updatedAt: true,
      createdAt: true,
      profilePictureName: true,
      biography: true
    }
  });

  if (user === null) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: "Requested user doesn't exist"
      }
    };
  }

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        mail: user.mail,
        released: user.released,
        role: user.role,
        profilePictureName: user.profilePictureName,
        biography: user.biography,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
      }
    }
  };
}

async function patchUser({
  requestUserId,
  patchUserId,
  mail,
  firstname,
  lastname,
  password,
  roleId,
  released,
  biography
}: {
  requestUserId: string;
  patchUserId: string;
  mail: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  password: string | undefined;
  roleId: number | undefined;
  released: boolean | undefined;
  biography: string | undefined | null;
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

  if (
    (released !== undefined || roleId !== undefined || mail !== undefined) &&
    !userCanModifyOtherUser &&
    patchUserId !== requestUserId
  ) {
    const notAllowedFields = Object.keys({
      released,
      roleId,
      mail
    });

    return {
      status: 'unauthorized',
      statusCode: 401,
      send: {
        status: 'unauthorized',
        message: `You are not allowed to update the following fields: ${notAllowedFields.join(',')}`
      }
    };
  }

  if (password !== undefined) {
    password = await hashPassword(password);
  }

  const update = await prisma.user.update({
    where: { id: patchUserId },
    data: {
      mail,
      firstname,
      lastname,
      password,
      roleId,
      released,
      biography
    }
  });

  if (!update) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: 'Updating the user failed'
      }
    };
  }

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: 'User updated'
    }
  };
}

async function getUserTeachingSkills({
  id
}: {
  id: string;
}): Promise<Return<Record<string, any> | string>> {
  const skills = await prisma.user.findFirst({
    where: {
      id
    },
    select: {
      id: true,
      skillsToTeach: true
    }
  });

  if (skills === null) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: "Requested user doesn't exist"
      }
    };
  }

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: {
        id: skills.id,
        skillsToTeach: skills.skillsToTeach
      }
    }
  };
}

async function patchUserTeachingSkills({
  requestUserId,
  patchUserId,
  teachSkillIds
}: {
  requestUserId: string;
  patchUserId: string;
  teachSkillIds: number[];
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

  if (
    teachSkillIds !== undefined &&
    !userCanModifyOtherUser &&
    patchUserId !== requestUserId
  ) {
    const notAllowedFields = Object.keys({
      teachSkillIds
    });

    return {
      status: 'unauthorized',
      statusCode: 401,
      send: {
        status: 'unauthorized',
        message: `You are not allowed to update the following fields: ${notAllowedFields.join(',')}`
      }
    };
  }

  const userTeachingSkills = await prisma.user.findFirst({
    where: {
      id: patchUserId
    },
    select: {
      skillsToTeach: true
    }
  });

  if (userTeachingSkills === null) {
    return {
      status: 'error',
      statusCode: 401,
      send: {
        status: 'error',
        message: "User doesn't exist."
      }
    };
  }

  for (let i = 0; i < teachSkillIds.length; i++) {
    if (!(await skillExists({ id: teachSkillIds[i] }))) {
      return {
        status: 'error',
        statusCode: 400,
        send: {
          status: 'error',
          message: 'Invalid skill id'
        }
      };
    }
  }

  const removingSkills = userTeachingSkills.skillsToTeach.filter((e) => {
    return !teachSkillIds.includes(e.id);
  });

  const learningSkills = teachSkillIds.filter((e) => {
    return !userTeachingSkills.skillsToTeach.map((e) => e.id).includes(e);
  });

  for (let i = 0; i < removingSkills.length; i++) {
    await prisma.user.update({
      where: {
        id: patchUserId
      },
      data: {
        skillsToTeach: {
          disconnect: {
            id: removingSkills[i].id
          }
        }
      }
    });
  }

  for (let i = 0; i < learningSkills.length; i++) {
    await prisma.user.update({
      where: {
        id: patchUserId
      },
      data: {
        skillsToTeach: {
          connect: {
            id: learningSkills[i]
          }
        }
      }
    });
  }

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: 'User updated'
    }
  };
}

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 8);
}

async function deleteUser({
  requestUserId
}: {
  requestUserId: string;
}): Promise<Return<string>> {
  const userData = await prisma.user.findFirst({
    where: {
      id: requestUserId
    }
  });

  if (!userData) {
    return {
      status: 'error',
      statusCode: 400,
      send: {
        status: 'error',
        message: 'User does not exist'
      }
    };
  }

  await prisma.user.update({
    where: {
      id: requestUserId
    },
    data: {
      teachingInformation: {
        delete: {}
      },
      socialMedia: {
        delete: {}
      },
      skillsToTeach: {
        set: []
      }
    }
  });

  await prisma.user.delete({
    where: {
      id: requestUserId
    }
  });

  return {
    status: 'success',
    statusCode: 200,
    send: {
      status: 'success',
      message: 'User deleted'
    }
  };
}

export {
  signup,
  login,
  getUserData,
  patchUser,
  getUserTeachingSkills,
  patchUserTeachingSkills,
  deleteUser
};
