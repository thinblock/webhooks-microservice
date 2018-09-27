interface EnvConfig {
  root: string;
  name: string;
  port: number;
  env: string;
  debug: boolean;
  snsNotificationARN: string;
  db: string;
  test: boolean;
  aws_region: string;
}

export {
  EnvConfig
};