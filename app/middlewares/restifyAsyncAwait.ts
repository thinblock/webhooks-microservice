import { Server } from 'restify';
import * as restifyPromise from 'restify-await-promise';

const asyncAwaitMiddleware = (server: Server) => {
  // The second param takes options using which you can check on every exception
  restifyPromise.install(server);
};

export {
  asyncAwaitMiddleware
};