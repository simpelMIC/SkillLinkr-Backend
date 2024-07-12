import { Request, Response } from 'express';
import { signup } from '../../../../functions/user.js';
import EmailValidator from 'email-validator';

const post = function () {
  return async function (req: Request, res: Response) {
    const {
      mail,
      firstname,
      lastname,
      password,
      passwordConfirm
    }: {
      mail: string;
      firstname: string;
      lastname: string;
      password: string;
      passwordConfirm: string;
    } = req.body;

    if (
      typeof mail !== 'string' ||
      typeof firstname !== 'string' ||
      typeof lastname !== 'string' ||
      typeof password !== 'string' ||
      typeof passwordConfirm !== 'string'
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

    if (!EmailValidator.validate(mail)) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Invalid mail address'
        })
        .end();

      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Password to short'
        })
        .end();

      return;
    }

    if (password !== passwordConfirm) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Passwords doesnt match'
        })
        .end();

      return;
    }

    const register = await signup({ firstname, lastname, password, mail });

    res.status(register.statusCode).send(register.send).end();
    return;
  };
};

export { post };
