import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { publicRouter } from './routes/router/publicRoutes.js';
import { tokenRouter } from './routes/router/tokenRoutes.js';
import { logger } from '@middleware/logger.js';
import { setResponseHeader } from '@middleware/setResponseHeader.js';

config({
  path: '../../.env'
});

const app = express();

app.use(logger);
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(setResponseHeader);
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use('/api', publicRouter);
app.use('/api', tokenRouter);
app.use(
  '/public',
  express.static(join(dirname(fileURLToPath(import.meta.url)), '../public'))
);

const port = parseInt(process.env.PORT ?? '8080');

app.listen(port, () => {
  console.log(`listening on port localhost:${port}`);
});
