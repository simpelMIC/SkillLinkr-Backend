import { prisma } from '../../database/prisma.js';

async function getRolePermissionNames({
  roleId
}: {
  roleId: number;
}): Promise<null | string[]> {
  const role = await prisma.role.findFirst({
    where: {
      id: roleId
    },
    select: {
      permissions: true
    }
  });

  if (role === null) {
    return null;
  }

  return role.permissions.map((e) => e.name);
}

async function userHasPermission({
  userId,
  permissionName
}: {
  userId: number;
  permissionName: string;
}): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      role: true
    }
  });

  if (user === null) {
    return false;
  }

  const userPermissions = await getRolePermissionNames({
    roleId: user.role.id
  });

  if (userPermissions === null) {
    return false;
  }

  return userPermissions.includes(permissionName);
}

export { getRolePermissionNames, userHasPermission };
