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
import {
  post as userProfilePicturePost,
  patch as userProfilePicturePatch,
  deleteFile as userProfilePictureDelete
} from '@handler/user/profilepicture/profilepicture.js';
import { get as skillCategoriesGet } from '@handler/skillcategories/skillcategories.js';
import { get as skillCategoryGet } from '@handler/skillcategory/skillcategory.js';
import { get as skillsGet } from '@handler/skills/skills.js';
import { get as specificSkillGet } from '@handler/skill/specific/specific.js';
import { get as teachersSkillGet } from '@handler/skill/teachers/teachers.js';
import { get as otherUserGet } from '@handler/user/other/user.js';

const tokenRouter = express.Router();
tokenRouter.use(verifyToken());

// ! Reactive when subData exist
// tokenRouter.get('/user/:subData?', userGet());
tokenRouter.get('/user', userGet());
tokenRouter.get('/user/other/:id', otherUserGet());
tokenRouter.patch('/user', userPatch());
tokenRouter.get('/user/released', userReleasedGet());
tokenRouter.get('/user/teachinginformation', userTeachingGet());
tokenRouter.patch('/user/teachinginformation', userTeachingPatch());
tokenRouter.get('/user/socialmedia', userSocialMediaGet());
tokenRouter.patch('/user/socialmedia', userSocialMediaPatch());
tokenRouter.get('/user/skills', userSkillsGet());
tokenRouter.patch('/user/skills', userSkillsPatch());
tokenRouter.post('/user/profilepicture', userProfilePicturePost());
tokenRouter.patch('/user/profilepicture', userProfilePicturePatch());
tokenRouter.delete('/user/profilepicture', userProfilePictureDelete());
tokenRouter.get('/skill/specific/:id', specificSkillGet());
tokenRouter.get('/skill/teachers/:id', teachersSkillGet());
tokenRouter.get('/skills/:fromCategoryId', skillsGet());
tokenRouter.get('/skillcategory/:id', skillCategoryGet());
tokenRouter.get('/skillcategories', skillCategoriesGet());

export { tokenRouter };
