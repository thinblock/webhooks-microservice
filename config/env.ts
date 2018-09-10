import * as path from 'path';
import { EnvConfig } from '../app/interfaces/utils/IConfigSettings';

const env: string = process.env.NODE_ENV || 'development';
const debug: boolean = !!process.env.DEBUG || false;
const isDev: boolean = env === 'development';
const isTestEnv: boolean = env === 'test';
// default settings are for dev environment
const config: EnvConfig = {
  name: 'TB-WORKERS-API',
  env: env,
  test: isTestEnv,
  debug: debug,
  root: path.join(__dirname, '/..'),
  port: 8080,
  db: process.env.TB_WORKERS_REDIS_DB_STRING,
  aws_region: process.env.TB_AWS_REGION || 'ap-southeast-1'
};

const services = {
  jobs: {
    url: 'http://jobs.service.thinblock.io',
  }
};


// settings for test environment
if (env === 'production') {
  config.port = 5005;
  config.debug = false;
}

export { config, services };
