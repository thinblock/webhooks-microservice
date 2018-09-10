import * as fs from 'fs';
import * as restify from 'restify';
import * as path from 'path';
import * as joiMiddleware from 'restify-joi-middleware';
import * as glob from 'glob-fs';
import { asyncAwaitMiddleware } from '../app/middlewares/restifyAsyncAwait';
import { IRoute, AuthStrategies, HttpMethods } from '../app/interfaces/utils/Route';
import { config } from './env';
import { logger } from '../utils/logger';
import requestsLogger from '../utils/requestsLogger';


// get path to route handlers
const pathToRoutes: string = '**/**/*.route.ts';

// create Restify server with the configured name
const app: restify.Server = restify.createServer({
  name: 'config.name',
  log: logger,
});

const buildServer = async (): Promise<restify.Server> => {
  asyncAwaitMiddleware(app);
  // parse the body of the request into req.params
  app.use(restify.bodyParser({ mapParams: false }));
  app.use(restify.queryParser());
  // Adds JOI middleware for validating the params
  app.use(joiMiddleware());

  // user-defined middleware
  app.use((req: restify.Request, res: restify.Response, next: any) => {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // disable caching so we'll always get the latest data
    res.setHeader('Cache-Control', 'no-cache');

    // log the request method and url
    logger.info(`#${req.id()} ${req.method} ${req.url} with params: ${JSON.stringify(req.params)}`);

    return next();
  });

  if (config.env !== 'test') {
    app.use(requestsLogger());
  }

  let files: string[] = glob().readdirSync(pathToRoutes);
  // add route handlers
  for (const file of files) {
    try {
      const ServerRoute = (
        await import(path.join(config.root, file.replace('.ts', '.js')))
      ).default;
      const servRoute: IRoute = new ServerRoute();
      const basePath = servRoute.basePath;
      const routes = servRoute.getServerRoutes();

      if (routes.length > 5) {
        throw new Error(`
          ${file}: A Route can have maximum of 5 routes per
          file e.g getAll, get, put, post, delete
        `);
      }
      routes.forEach((route) => {
        const argsArr = [];
        const options = {
          path: '/' + basePath + (route.param ? ('/:' + route.param) : ''),
          validation: route.validation
        };
        argsArr.push(options);
        argsArr.push(route.handler);

        let method = 'get';
        switch (route.method) {
        case HttpMethods.GET:
          app.get.apply(app, argsArr);
          break;
        case HttpMethods.POST:
          app.post.apply(app, argsArr);
          break;
        case HttpMethods.PUT:
          app.put.apply(app, argsArr);
          break;
        case HttpMethods.DELETE:
          app.del.apply(app, argsArr);
          break;
        }
      });
    } catch (e) {
      console.log(`Failed to load ${file}`, e);
      process.exit(1);
    }
  }

  return app;
};



export { buildServer };
