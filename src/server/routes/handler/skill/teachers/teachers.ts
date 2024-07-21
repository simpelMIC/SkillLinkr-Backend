import { Request, Response } from 'express';
import { getSkillTeacher } from '@functions/skill/skills.js';

const get = function () {
  return async function (req: Request, res: Response) {
    const skillId = parseInt(req.params.id);

    if (typeof skillId !== 'number' || isNaN(skillId)) {
      res.status(400).send({
        status: 'error',
        message: 'Invalid category id format'
      });

      return;
    }

    const data = await getSkillTeacher({ id: skillId });

    res.status(data.statusCode).send(data.send).end();

    return;
  };
};

export { get };
