import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@database/prisma.js';

const verifyToken = function () {
  return function (req: Request, res: Response, next: NextFunction) {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'JWT'
    ) {
      jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.API_SECRET as string,
        async (err, decode) => {
          if (err || !decode || typeof decode === 'string') {
            req.user = undefined;
            res
              .status(401)
              .send({
                status: 'unauthorized',
                message: 'You are not authorized to view this route'
              })
              .end();
            return;
          }
          const id = decode.id;
          const user = await prisma.user.findFirst({
            where: {
              id: id
            },
            select: {
              createdAt: true,
              id: true,
              firstname: true,
              lastname: true,
              released: true,
              role: true,
              password: false,
              updatedAt: true,
              mail: true,
              roleId: true,
              teachingInformation: true,
              socialMedia: true
            }
          });
          if (!user) {
            res
              .status(400)
              .send({
                status: 'error',
                message: "This account doesn't exist."
              })
              .end();
            return;
          }

          if (!user.released) {
            res
              .status(401)
              .send({
                status: 'unreleased',
                message: 'The account is not released'
              })
              .end();
            return;
          }

          req.user = user;
          next();
        }
      );
    } else {
      res
        .status(400)
        .send({
          status: 'error',
          message: 'Missing token'
        })
        .end();
      return;
    }
  };
};

export { verifyToken };
