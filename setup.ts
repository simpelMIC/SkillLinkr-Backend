/* eslint-disable no-empty */
import chokidar from 'chokidar';
import fse from 'fs-extra';
import { join } from 'path';

const watcher = chokidar.watch(
  ['./src/database/prisma/generated', './src/public'],
  {
    persistent: true
  }
);

watcher
  .on('add', () => {
    work();
  })
  .on('change', () => {
    work();
  })
  .on('unlink', () => {
    work();
  });

console.log('Watcher started');

const work = function () {
  try {
    fse.copySync(
      join('./src/database/prisma/generated'),
      join('./build/database/prisma/generated'),
      {
        overwrite: true
      }
    );
  } catch {}

  try {
    fse.copySync(join('./src/public'), join('./build/public'), {
      overwrite: true
    });
  } catch {}
};

work();
