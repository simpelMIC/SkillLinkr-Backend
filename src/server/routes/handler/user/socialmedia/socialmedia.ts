import { Request, Response } from 'express';
import {
  getUserSocialMediaData,
  patchUserSocialMedia
} from '../../../../../functions/socialmedia.js';

const get = function () {
  return async function (req: Request, res: Response) {
    const userId = req.user?.id!;

    const data = await getUserSocialMediaData({ userId: userId });

    res.status(data.statusCode).send(data.send).end();

    return;
  };
};

const patch = function () {
  return async function (req: Request, res: Response) {
    const requestUserId = req.user?.id!;

    const {
      discordName,
      facebookName,
      instagramName,
      xName,
      patchUserId
    }: {
      discordName: string | undefined | null;
      facebookName: string | undefined | null;
      instagramName: string | undefined | null;
      xName: string | undefined | null;
      patchUserId: string;
    } = req.body;

    if (
      (!['string', 'undefined'].includes(typeof discordName) &&
        discordName !== null) ||
      (!['string', 'undefined'].includes(typeof facebookName) &&
        facebookName !== null) ||
      (!['string', 'undefined'].includes(typeof instagramName) &&
        instagramName !== null) ||
      (!['string', 'undefined'].includes(typeof xName) && xName !== null) ||
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

    const socialMediaUpdate = await patchUserSocialMedia({
      discordName,
      facebookName,
      instagramName,
      patchUserId,
      requestUserId,
      xName
    });

    res.status(socialMediaUpdate.statusCode).send(socialMediaUpdate.send).end();

    return;
  };
};

export { get, patch };
