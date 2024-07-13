import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/prisma.js';
import type { Return } from '../types/Return.js';
import { userHasPermission } from './helper/role.js';

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

function signToken(id: number): string {
  return jwt.sign(
    {
      id: id
    },
    process.env.api_secret as string,
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
  id: number;
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
      role: true
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
        role: user.role
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
  released
}: {
  requestUserId: number;
  patchUserId: number;
  mail: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  password: string | undefined;
  roleId: number | undefined;
  released: boolean | undefined;
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
      released
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

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 8);
}

export { signup, login, getUserData, patchUser };
