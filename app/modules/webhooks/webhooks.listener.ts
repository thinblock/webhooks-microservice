import { InternalServerError, NotFoundError } from 'restify-errors';
import to from 'await-to-js';
import IController from '../../interfaces/utils/IController';
import { IRequest, IResponse } from '../../interfaces/utils/IServer';
import { validateAndConfirmMessage } from '../../../utils/helpers';
import { Next } from 'restify';
import { enqueueJob } from '../../../config/kue';
import { getJob } from '../../../utils/jobs_service';

export default class WebhooksListener implements IController {
  public async post(req: IRequest, res: IResponse, next: Next) {
    try {
      // TODO: check the payload for required params for actions via params_schema
      // of actions
      const webhookPayload = req.body;
      const jobId = req.params.jobId;

      const [err, job] = await to(getJob(jobId));

      if (err) {
        req.log.error(err);
        return res.send(new NotFoundError('A Job associated with this Hook was not found!'));
      }

      const jobData = job;
      const enqueuedJob = await enqueueJob(jobData);
      req.log.info('[i] Created job with ID: ', enqueuedJob.id);
      return res.send({ success: true, job_id: enqueuedJob.id });
    } catch (e) {
      req.log.error(e);
      return res.send(new InternalServerError());
    }
  }

}
