import { NextFunction, Request, Response } from 'express';

const setResponseHeader = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  res.set('Cross-Origin-Opener-Policy', 'cross-origin');
  next();
};

export { setResponseHeader };
