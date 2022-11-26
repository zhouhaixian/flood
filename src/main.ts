import fs from 'fs/promises';
import { RequestError } from 'got';
import log4js from 'log4js';
import path from 'path';
import { CaptchaError, APIError } from './errors';
import { API, Blacklist, Targets } from './types';
import { wait } from './utils/wait';

(async function main() {
  process.on('unhandledRejection', () => {
    null;
  });

  log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      app: {
        type: 'file',
        filename: 'logs/app.log',
        maxLogSize: 51200,
        keepFileExt: true,
      },
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'info' },
    },
  });

  const targets = JSON.parse(
    (
      await fs.readFile(path.resolve(__dirname, '../configs/targets.json'))
    ).toString(),
  ) as Targets;

  const blacklist = JSON.parse(
    (
      await fs.readFile(path.resolve(__dirname, '../configs/blacklist.json'))
    ).toString(),
  ) as Blacklist;

  const files = await fs.readdir(path.resolve(__dirname, './api'));
  const apis = [] as API[];
  for (const file of files) {
    const name = file.toString().replace('.ts', '').replace('.js', '');
    if (blacklist.includes(name)) continue;

    apis.push({
      name,
      ...(await import(`./api/${name}`)),
    });
  }

  for (const target of targets) {
    apiScheduler(target);
    await wait(61000);
  }

  async function apiScheduler(target: string) {
    while (true) {
      for (const api of apis) {
        const logger = log4js.getLogger(api.name);
        (async function launch() {
          try {
            const result = await api.default(target, logger);
            logger.info(`目标：${target}, 响应: ${JSON.stringify(result)}`);
          } catch (e: any) {
            if (e instanceof CaptchaError) {
              wait(5000).then(launch);
            }
            if (e instanceof APIError) {
              logger.error(
                `目标：${target}, 错误类型: ${e.name}, 错误信息: ${
                  e.message
                }, 响应: ${JSON.stringify(e.response ?? {})}`,
              );
            } else if (e instanceof RequestError) {
              logger.error(
                `目标：${target}, 错误类型: ${e.name}, 错误信息: ${
                  e.message
                }, 响应: ${JSON.stringify(e.response?.body ?? {})}`,
              );
            } else {
              logger.error(
                `目标：${target}, 错误类型: ${e.name}, 错误信息: ${e.message}`,
              );
            }
          }
        })();
        await wait(120000);
      }
    }
  }
})();
