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

export { tokenRouter };
