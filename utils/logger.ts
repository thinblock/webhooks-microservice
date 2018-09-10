import * as bunyan from 'bunyan';
import { Request } from 'restify';
import * as stream from 'stream';
import { config } from '../config/env';

interface LoggerSettings {
  name: string;
  serializers: any;
  streams: Array<Object>;
}

const infoStream = new stream.Writable();
infoStream.writable = true;
infoStream.write = (info: any): boolean => {
  console.log(`====== ${JSON.parse(info).msg} =====`);
  return true;
};

let settings: LoggerSettings = {
  name: config.env,
  serializers: {
    req: (req: Request) => ({
      headers: req.headers,
      url: req.url,
      method: req.method
    }),
  },
  streams: []
};

if (config.env === 'development') {
  settings.streams.push({ level: 'info', stream: infoStream });
}

if (config.env === 'production') {
  settings.streams.push({ level: 'info', path: `logs/api.log` });
}

if (config.debug) {
  settings.streams.push({ level: 'trace', stream: infoStream });
  settings.streams.push({ level: 'debug', path: 'debug.log' });
}

const logger = bunyan.createLogger(settings);
console.log(`Logger setting: ${settings.name}`);

export { logger };
