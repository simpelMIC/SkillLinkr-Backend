import express from 'express';
import { verifyToken } from '@middleware/authJwt.js';
import { get as userGet, patch as userPatch } from '@handler/user/user.js';
import { get as userReleasedGet } from '@handler/user/released/released.js';
import {
  get as userTeachingGet,
  patch as userTeachingPatch
} from '@handler/user/teachinginformation/teachinginformation.js';
import {
  get as userSocialMediaGet,
  patch as userSocialMediaPatch
} from '@handler/user/socialmedia/socialmedia.js';
import {
  get as userSkillsGet,
  patch as userSkillsPatch
} from '@handler/user/skills/skills.js';
import { get as skillCategoriesGet } from '@handler/skillcategories/skillcategories.js';
import { get as skillCategoryGet } from '@handler/skillcategory/skillcategory.js';
import { get as skillsGet } from '@handler/skills/skills.js';
import { get as specificSkillGet } from '@handler/skill/specific/specific.js';
import { get as teachersSkillGet } from '@handler/skill/teachers/teachers.js';

const tokenRouter = express.Router();
tokenRouter.use(verifyToken());

// ! Reactive when subData exist
// tokenRouter.get('/user/:subData?', userGet());
tokenRouter.get('/user', userGet());
tokenRouter.patch('/user', userPatch());
tokenRouter.get('/user/released', userReleasedGet());
tokenRouter.get('/user/teachinginformation', userTeachingGet());
tokenRouter.patch('/user/teachinginformation', userTeachingPatch());
tokenRouter.get('/user/socialmedia', userSocialMediaGet());
tokenRouter.patch('/user/socialmedia', userSocialMediaPatch());
tokenRouter.get('/user/skills', userSkillsGet());
tokenRouter.patch('/user/skills', userSkillsPatch());
tokenRouter.get('/skill/specific/:id', specificSkillGet());
tokenRouter.get('/skill/teachers/:id', teachersSkillGet());
tokenRouter.get('/skills/:fromCategoryId', skillsGet());
tokenRouter.get('/skillcategory/:id', skillCategoryGet());
tokenRouter.get('/skillcategories', skillCategoriesGet());

export { tokenRouter };
