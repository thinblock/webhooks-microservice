import * as restify from 'restify';
import { config } from './config/env';
import { buildServer } from './config/restify';
import { logger } from './utils/logger';

let app: restify.Server = null;

const start = async () => {
  app = await buildServer();
  app.listen(config.port, () => {
    logger.info(`${config.name} is running at ${app.url}`);
  });
};

start();

export { app };
