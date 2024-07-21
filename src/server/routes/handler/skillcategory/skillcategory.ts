import { Request, Response } from 'express';
import { getSkillCategory } from '@functions/skill/skillCategories.js';

const get = function () {
  return async function (req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if (typeof id !== 'number' || isNaN(id)) {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Enter a number as id'
        })
        .end();

      return;
    }

    const data = await getSkillCategory({ id });

    res.status(data.statusCode).send(data.send).end();

    return;
  };
};

export { get };
