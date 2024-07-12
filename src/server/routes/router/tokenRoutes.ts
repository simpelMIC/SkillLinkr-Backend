import express from 'express';
import { verifyToken } from '../../middleware/authJwt.js';
import {
  get as userGet,
  patch as userPatch,
  userIsReleased
} from '../handler/user/user.js';

const tokenRouter = express.Router();
tokenRouter.use(verifyToken());

// ! Reactive when subData exist
// tokenRouter.get('/user/:subData?', userGet());
tokenRouter.get('/user', userGet());
tokenRouter.patch('/user', userPatch());
tokenRouter.get('/user/released', userIsReleased());

export { tokenRouter };
