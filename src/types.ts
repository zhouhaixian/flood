import log4js from 'log4js';

export type Targets = string[];

export type API = {
  name: string;
  default: (target: string, logger: log4js.Logger) => Promise<any>;
};

export type Blacklist = string[];
