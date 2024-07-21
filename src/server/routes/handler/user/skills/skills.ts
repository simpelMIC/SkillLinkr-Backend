import { Request, Response } from 'express';
import {
  getUserTeachingSkills,
  patchUserTeachingSkills
} from '@functions/user.js';

const get = () => {
  return async function (req: Request, res: Response) {
    const userId = req.user?.id!;
    const data = await getUserTeachingSkills({ id: userId });

    res.status(data.statusCode).send(data.send).end();

    return;
  };
};

const patch = function () {
  return async function (req: Request, res: Response) {
    const requestUserId = req.user?.id!;

    const {
      patchUserId,
      teachSkillIds
    }: { patchUserId: string; teachSkillIds: string } = req.body;

    if (
      !['string'].includes(typeof teachSkillIds) ||
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

    let parsedTeachSkillIds: number[];

    try {
      parsedTeachSkillIds = JSON.parse(teachSkillIds);
    } catch (error) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Invalid parameter format'
        })
        .end();

      return;
    }

    if (
      !['object'].includes(typeof parsedTeachSkillIds) ||
      parsedTeachSkillIds.find((e) => typeof e !== 'number')
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

    const socialMediaUpdate = await patchUserTeachingSkills({
      teachSkillIds: parsedTeachSkillIds,
      patchUserId,
      requestUserId
    });

    res.status(socialMediaUpdate.statusCode).send(socialMediaUpdate.send).end();

    return;
  };
};

export { get, patch };
