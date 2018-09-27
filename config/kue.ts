import { createQueue, Job } from 'kue';
import { logger } from '../utils/logger';
import { publishMessage, triggerNotification } from '../utils/helpers';
import { config } from './env';
import { oneLine } from 'common-tags';

const queue = createQueue({ redis: config.db });

queue.process('hooks-worker', function (job, done) {
  const jobData = job.data;
  processJob(jobData)
    .then(() => {
      logger.info(oneLine`
        [i] Job (${jobData._id}) with QueueId: ${job.id} finished successfully
      `);
      done();
    })
    .catch((e) => {
      logger.error(oneLine`
        [Err] Job (${jobData._id}) with QueueId: ${job.id} errored
      `, e);
      done(e);
    });
});

async function processJob(jobData: any) {
  const actions: any[] = jobData.actions;
  let errored = null;

  try {
    try {
      triggerNotification({ jobId: jobData._id, event: 'webhook_triggered', data: {} });
    } catch (e) {
      logger.error(oneLine`[Error] Error while notifying event for Job: ${jobData._id}`);
    }
    logger.info(`[i] Publishing events for ${actions.length} actions with Job: ${jobData._id}`);
    await publishActions(actions);
    logger.info(oneLine`
      [i] Published events for ${actions.length} actions was successfull
      with Job: ${jobData._id}
    `);
  } catch (e) {
    logger.info(oneLine`
      [Err] Error occurred while publishing events for the actions of Job: ${jobData._id}
    `, e);
    errored = e;
  }

  if (errored) {
    // TODO: if error, add it to failed jobs queue
    throw errored;
  }

  return true;
}

async function publishActions(actions: any[]) {
  await Promise.all(actions.map((obj: any) => (
    publishMessage(
      obj.action.sns_topic_arn,
      JSON.stringify({
        id: obj.action._id, params: obj.params,
        params_schema: obj.action.params_schema
      })
    )
  )));
}

export function enqueueJob(data: any) {
  return new Promise<Job>((resolve, reject) => {
    const job = queue.create('hooks-worker', data).save((err: Error) => {
      if (err) {
        return reject(err);
      }
      return resolve(job);
    });
  });
}

export default queue;