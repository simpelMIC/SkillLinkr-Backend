import { Request, Response } from 'express';
import { getSkillCategories } from '@functions/skill/skillCategories.js';

const get = function () {
  return async function (req: Request, res: Response) {
    const data = await getSkillCategories();

    res.status(data.statusCode).send(data.send).end();

    return;
  };
};

export { get };
