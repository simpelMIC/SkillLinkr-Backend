import { Request, Response } from 'express';
import { getUserData, patchUser } from '../../../../functions/user.js';
import { prisma } from '../../../../database/prisma.js';
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

const userIsReleased = () => {
  return async function (req: Request, res: Response) {
    const userId = req.user?.id!;
    const data = await getUserData({ id: userId });

    if (typeof data.send.message === 'object' && data.send.message.released) {
      res
        .status(200)
        .send({
          status: 'success',
          message: 'The account is released'
        })
        .end();

      return;
    }

    res
      .status(401)
      .send({
        status: 'unreleased',
        message: 'The account is not released'
      })
      .end();

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
      patchUserId
    }: {
      mail: string | undefined;
      firstname: string | undefined;
      lastname: string | undefined;
      password: string | undefined;
      roleId: number | undefined;
      released: boolean | undefined;
      patchUserId: number;
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
      typeof patchUserId !== 'number'
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
      roleId
    });

    res.status(userUpdate.statusCode).send(userUpdate.send).end();

    return;
  };
};

export { get, patch, userIsReleased };
