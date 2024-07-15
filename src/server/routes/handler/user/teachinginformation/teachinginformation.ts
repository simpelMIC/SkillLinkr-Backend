import { Request, Response } from 'express';
import { getUserTeachingData, patchUserTeaching } from '@functions/teaching.js';

const get = function () {
  return async function (req: Request, res: Response) {
    const userId = req.user?.id!;

    const data = await getUserTeachingData({ userId: userId });

    res.status(data.statusCode).send(data.send).end();

    return;
  };
};

const patch = function () {
  return async function (req: Request, res: Response) {
    const requestUserId = req.user?.id!;

    const {
      teachesOnline,
      teachesInPerson,
      teachingCity,
      teachingCountry,
      patchUserId
    }: {
      teachesOnline: boolean | undefined;
      teachesInPerson: boolean | undefined;
      teachingCity: string | undefined | null;
      teachingCountry: string | undefined | null;
      patchUserId: string;
    } = req.body;

    if (
      !['boolean', 'undefined'].includes(typeof teachesOnline) ||
      !['boolean', 'undefined'].includes(typeof teachesInPerson) ||
      (!['string', 'undefined'].includes(typeof teachingCity) &&
        teachingCity !== null) ||
      (!['string', 'undefined'].includes(typeof teachingCountry) &&
        teachingCountry !== null) ||
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

    const teachingUpdate = await patchUserTeaching({
      patchUserId,
      requestUserId,
      teachesInPerson,
      teachesOnline,
      teachingCity,
      teachingCountry
    });

    res.status(teachingUpdate.statusCode).send(teachingUpdate.send).end();

    return;
  };
};

export { get, patch };
