import * as restifyLogger from 'restify-logger';

restifyLogger.token('user', () => '');

const logger = () => restifyLogger('custom', {
  skip: (req: any) => req.method === 'OPTIONS'
});

export default logger;