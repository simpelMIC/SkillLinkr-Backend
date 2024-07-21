import { Request, Response } from 'express';
import { getSkills } from '@functions/skill/skills.js';

const get = function () {
  return async function (req: Request, res: Response) {
    const skillCategoryId = parseInt(req.params.fromCategoryId);

    if (typeof skillCategoryId !== 'number' || isNaN(skillCategoryId)) {
      res.status(400).send({
        status: 'error',
        message: 'Invalid category id format'
      });

      return;
    }

    const data = await getSkills({ skillCategoryId });

    res.status(data.statusCode).send(data.send).end();

    return;
  };
};

export { get };
