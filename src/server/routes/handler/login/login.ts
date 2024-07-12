import { Request, Response } from 'express';
import { login } from '../../../../functions/user.js';

const post = function () {
  return async function (req: Request, res: Response) {
    const {
      mail,
      password
    }: {
      mail: string;
      password: string;
    } = req.body;

    if (typeof mail !== 'string' || typeof password !== 'string') {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Missing parameter'
        })
        .end();

      return;
    }

    const loginAction = await login({ mail, password });
    res.status(loginAction.statusCode).send(loginAction.send).end();

    return;
  };
};

export { post };
