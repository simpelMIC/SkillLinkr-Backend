import { Request, Response } from 'express';
import util from 'util';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { prisma } from '@database/prisma.js';
import { rmSync } from 'fs';

const patch = () => {
  return async function (req: Request, res: Response) {
    const maxSize = 2 * 1024 * 1024;
    const filename = (
      await prisma.user.findFirst({
        where: {
          id: req.user?.id!
        },
        select: {
          profilePictureName: true
        }
      })
    )?.profilePictureName;

    if (filename == null || filename == undefined) {
      res.status(400).send({
        status: 'error',
        message: 'User has no profile picture'
      });

      return;
    }

    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(
          null,
          process.env.INIT_CWD + '\\build\\public\\profilepictures'
        );
      },
      filename: (req, file, callback) => {
        callback(null, filename);
      }
    });

    const upload = util.promisify(
      multer({
        storage: storage,
        limits: {
          fileSize: maxSize
        },
        fileFilter: (req, file, callback) => {
          if (file.mimetype === 'image/png') {
            callback(null, true);
          }
          callback(null, false);
        }
      }).single('file')
    );

    try {
      if (
        (req.headers['content-type'] &&
          !req.headers['content-type']
            .toLowerCase()
            .startsWith('multipart/form-data')) ||
        !req.headers['content-type']
      ) {
        res
          .status(400)
          .send({ status: 'error', message: 'Please upload a file' });

        return;
      }
      await upload(req, res);

      if (req.file === undefined) {
        res.status(400).send({
          status: 'error',
          message: 'Upload failed'
        });
      } else {
        res.status(200).send({
          status: 'success',
          message: 'Uploaded the file successfully'
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: 'Could not upload the file' + error
      });
    }
    return;
  };
};

const post = () => {
  return async function (req: Request, res: Response) {
    const userHasProfilePicture =
      (
        await prisma.user.findFirst({
          where: {
            id: req.user?.id!
          },
          select: {
            profilePictureName: true
          }
        })
      )?.profilePictureName !== null;

    if (userHasProfilePicture) {
      res.status(400).send({
        status: 'error',
        message: 'User has already a profile picture'
      });
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    const filename = randomUUID() + '.png';

    const storage = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(
          null,
          process.env.INIT_CWD + '\\build\\public\\profilepictures'
        );
      },
      filename: (req, file, callback) => {
        callback(null, filename);
      }
    });

    const upload = util.promisify(
      multer({
        storage: storage,
        limits: {
          fileSize: maxSize
        },
        fileFilter: (req, file, callback) => {
          if (file.mimetype === 'image/png') {
            callback(null, true);
          }
          callback(null, false);
        }
      }).single('file')
    );

    try {
      if (
        (req.headers['content-type'] &&
          !req.headers['content-type']
            .toLowerCase()
            .startsWith('multipart/form-data')) ||
        !req.headers['content-type']
      ) {
        res
          .status(400)
          .send({ status: 'error', message: 'Please upload a file' });

        return;
      }
      await upload(req, res);

      if (req.file === undefined) {
        res.status(400).send({
          status: 'error',
          message: 'Upload failed'
        });
      } else {
        await prisma.user.update({
          where: {
            id: req.user?.id!
          },
          data: {
            profilePictureName: filename
          }
        });

        res.status(201).send({
          status: 'success',
          message: 'Uploaded the file successfully'
        });
      }
    } catch (error) {
      res.status(500).send({
        status: 'error',
        message: 'Could not upload the file' + error
      });
    }
    return;
  };
};

const deleteFile = () => {
  return async function (req: Request, res: Response) {
    const filename = (
      await prisma.user.findFirst({
        where: {
          id: req.user?.id!
        },
        select: {
          profilePictureName: true
        }
      })
    )?.profilePictureName;

    if (filename == null || filename == undefined) {
      res.status(400).send({
        status: 'error',
        message: 'User has no profile picture'
      });

      return;
    }

    rmSync(
      process.env.INIT_CWD + '\\build\\public\\profilepictures\\' + filename
    );

    await prisma.user.update({
      where: {
        id: req.user?.id!
      },
      data: {
        profilePictureName: null
      }
    });

    res.status(200).send({
      status: 'success',
      message: 'Deleted the file successfully'
    });

    return;
  };
};

export { post, patch, deleteFile };
