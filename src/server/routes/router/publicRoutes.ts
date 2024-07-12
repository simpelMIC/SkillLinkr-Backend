import express from 'express';
import { post as registerPost } from '../handler/register/register.js';
import { post as loginPost } from '../handler/login/login.js';

const publicRouter = express.Router();
publicRouter.post('/register', registerPost());
publicRouter.post('/login', loginPost());

export { publicRouter };
