import { Request, Response } from 'express';
import { getUserData, patchUser, deleteUser } from '@functions/user.js';
import { prisma } from '@database/prisma.js';
import EmailValidator from 'email-validator';

const get = function () {
  return async function (req: Request, res: Response) {
    const userId = req.user?.id!;

    // const subData = req.params.subData?.toLowerCase();
    // ! When subdata will be used remove default assignment
    const data = await getUserData({ id: userId });
    // ! Existent for reuse
    // if (subData === 'x') {
    // data = await getUserData({ id: userId });
    // } else {
    // data = await getUserData({ id: userId });
    // }

    res.status(data.statusCode).send(data.send).end();

    return;
  };
};

const patch = function () {
  return async function (req: Request, res: Response) {
    const requestUserId = req.user?.id!;

    const {
      mail,
      firstname,
      lastname,
      password,
      roleId,
      released,
      biography,
      patchUserId
    }: {
      mail: string | undefined;
      firstname: string | undefined;
      lastname: string | undefined;
      password: string | undefined;
      roleId: number | undefined;
      released: boolean | undefined;
      biography: string | undefined | null;
      patchUserId: string;
    } = req.body;

    const roleExists = await prisma.role.findFirst({
      where: {
        id: roleId
      },
      select: {
        id: true
      }
    });

    if (
      !['string', 'undefined'].includes(typeof password) ||
      !['string', 'undefined'].includes(typeof mail) ||
      !['string', 'undefined'].includes(typeof firstname) ||
      !['string', 'undefined'].includes(typeof lastname) ||
      !['number', 'undefined'].includes(typeof roleId) ||
      (roleId !== undefined && !roleExists) ||
      !['boolean', 'undefined'].includes(typeof released) ||
      (!['string', 'undefined'].includes(typeof biography) &&
        biography !== null) ||
      typeof patchUserId !== 'string'
    ) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Missing parameter'
        })
        .end();

      return;
    }

    if (mail && !EmailValidator.validate(mail)) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Invalid mail address'
        })
        .end();

      return;
    }

    if (password && password.length < 8) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Password to short'
        })
        .end();

      return;
    }

    const userUpdate = await patchUser({
      firstname,
      lastname,
      mail,
      password,
      patchUserId,
      released,
      requestUserId,
      roleId,
      biography
    });

    res.status(userUpdate.statusCode).send(userUpdate.send).end();

    return;
  };
};

const deleteFunc = function () {
  return async function (req: Request, res: Response) {
    const requestUserId = req.user?.id!;

    const userDelete = await deleteUser({ requestUserId });

    res.status(userDelete.statusCode).send(userDelete.send).end();

    return;
  };
};

export { get, patch, deleteFunc };
