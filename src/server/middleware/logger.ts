import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk';

const logger = function (req: Request, res: Response, next: NextFunction) {
  const afterResponse = function () {
    const currentDate = new Date().toLocaleTimeString('de-de', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    switch (Math.floor(res.statusCode / 100)) {
      case 1:
        console.log(
          chalk.blueBright(
            `Information for '${req.url}' (Status ${res.statusCode}) on ${currentDate}`
          )
        );
        break;
      case 2:
        console.log(
          chalk.greenBright(
            `Successful request to '${req.url}' (Status ${res.statusCode}) on ${currentDate}`
          )
        );
        break;
      case 3:
        console.log(
          chalk.gray(
            `Redirected request from '${req.url}' to '${res.getHeader(
              'location'
            )}' (Status ${res.statusCode}) on ${currentDate}`
          )
        );
        break;
      case 4:
        console.log(
          chalk.redBright(
            `Clienterror on request to '${req.url}' (Status ${res.statusCode}) on ${currentDate}`
          )
        );
        break;
      case 5:
        console.log(
          chalk.redBright(
            `Servererror on request to '${req.url}' (Status ${res.statusCode}) on ${currentDate}`
          )
        );
        break;
      default:
        break;
    }
  };

  res.on('finish', afterResponse);

  next();
};

export { logger };
