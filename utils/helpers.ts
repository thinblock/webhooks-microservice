import { SNS, SharedIniFileCredentials, config as awsConfig } from 'aws-sdk';
import MessageValidator = require('sns-validator');
import { ISNSEvent, SNSEvents } from '../app/interfaces/utils/IAWS';
import { config } from '../config/env';
import { logger } from './logger';
import { oneLine } from 'common-tags';
import { UnauthorizedError, InternalServerError } from 'restify-errors';

awsConfig.update({ region: config.aws_region });

const publishMessage = async (TopicArn: string, Message: string) => {
  const snsClient = new SNS({
    credentials: new SharedIniFileCredentials({ profile: 'thinblock' })
  });
  return snsClient.publish({
    TopicArn,
    Message,
  }).promise();
};

const verifySNSSubscription = async (message: ISNSEvent): Promise<boolean> => {
  try {
    const snsClient = new SNS({
      credentials: new SharedIniFileCredentials({ profile: 'thinblock' })
    });
    await snsClient.confirmSubscription({
      AuthenticateOnUnsubscribe: 'true',
      Token: message.Token,
      TopicArn: message.TopicArn
    }).promise();
    return true;
  } catch (e) {
    logger.error(e, `Error while confirming sns subcription for arn:${message.TopicArn}`);
    return false;
  }
};

const isValidSNSMessage = async (message: ISNSEvent): Promise<boolean> => {
  const validator = new MessageValidator();
  return new Promise<boolean>((resolve) => {
    validator.validate(message, (err: Error) => {
      if (err) {
        logger.error(
          err, oneLine`
            Error while validating sns message for arn:${message.TopicArn},
            messageId: ${message.MessageId}
          `
        );
        return resolve(false);
      }
      return resolve(true);
    });
  });
};

const validateAndConfirmMessage = async (notification: ISNSEvent): Promise<string> => {
  // Verify if the message is from AWS SNS
  const isValid = await isValidSNSMessage(notification);
  if (!isValid) {
    throw new UnauthorizedError('Message signature is invalid');
  }

  // If the notification type is SubscriptionConfirmation, confirm it
  console.log(
    notification.Type === SNSEvents.SubscriptionConfirmation,
    notification.Type, SNSEvents.SubscriptionConfirmation
  );
  if (notification.Type === SNSEvents.SubscriptionConfirmation) {
    const done = await verifySNSSubscription(notification);
    if (done) {
      return 'confirmed';
    }
    throw new InternalServerError();
  }

  // Do nothing
  if (notification.Type === SNSEvents.UnsubscribeConfirmation) {
    return 'nothing';
  }

  return 'success';
};

export {
  publishMessage,
  verifySNSSubscription,
  isValidSNSMessage,
  validateAndConfirmMessage
};
