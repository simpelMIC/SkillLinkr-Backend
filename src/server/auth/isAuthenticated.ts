import { Request } from 'express';

const isAuthenticated = function (req: Request) {
  return !!req.user;
};

export { isAuthenticated };
