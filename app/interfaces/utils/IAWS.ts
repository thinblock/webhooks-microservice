export interface ISNSEvent {
  Type: SNSEvents;
  MessageId: string;
  TopicArn: string;
  Message: string;
  Timestamp: string;
  SignatureVersion: string;
  Signature: string;
  SigningCertURL: string;
  Subject?: string;
  Token?: string;
  UnsubscribeURL?: string;
  SubscribeURL?: string;
}

export enum SNSEvents {
  SubscriptionConfirmation = 'SubscriptionConfirmation',
  Notification = 'Notification',
  UnsubscribeConfirmation = 'UnsubscribeConfirmation'
}