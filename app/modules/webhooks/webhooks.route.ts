import WebhooksListener from './webhooks.listener';
import * as Joi from 'joi';
import { IRoute, IRouteConfig, HttpMethods, AuthStrategies } from '../../interfaces/utils/Route';

class WebhooksRoute implements IRoute {
  public basePath = '/hooks';
  public controller = new WebhooksListener();

  public getServerRoutes(): IRouteConfig[] {
    return [
      {
        method: HttpMethods.POST,
        auth: AuthStrategies.PUBLIC,
        param: 'jobId',
        handler: this.controller.post,
        validation: {
          schema: {
            body: Joi.object(),
            params: {
              jobId: Joi.string().regex(
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
              ).required()
            }
          }
        }
      }
    ];
  }
}

export default WebhooksRoute;
