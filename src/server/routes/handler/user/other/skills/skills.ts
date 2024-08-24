import { Request, Response } from 'express';
import { getUserTeachingSkills } from '@functions/user.js';

const get = () => {
  return async function (req: Request, res: Response) {
    const searchUserId = req.params.id;

    if (typeof searchUserId !== 'string') {
      res.status(400).send({
        status: 'error',
        message: 'Invalid user id'
      });

      return;
    }
    const data = await getUserTeachingSkills({ id: searchUserId });

    res.status(data.statusCode).send(data.send).end();

    return;
  };
};

export { get };
