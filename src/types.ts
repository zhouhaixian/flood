import log4js from './logger';

export type Targets = string[];

export type API = {
  name: string;
  default: (target: string, logger: log4js.Logger) => Promise<any>;
};
