import { Request, Response } from 'express';
import { getUserData } from '@functions/user.js';

const get = () => {
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

export { get };
