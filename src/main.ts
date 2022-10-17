import fs from 'fs/promises';
import path from 'path';
import { API, Targets } from './types';
import { wait } from './wait';
import log4js from './logger';
import { CaptchaError } from './captcha-error';

(async function main() {
  const targets = JSON.parse(
    (
      await fs.readFile(path.resolve(__dirname, '../configs/targets.json'))
    ).toString(),
  ) as Targets;

  const files = await fs.readdir(path.resolve(__dirname, './api'));
  const apis = [] as API[];
  for (const file of files) {
    apis.push({
      name: file.toString().replace(/.ts/g, ''),
      ...(await import(`./api/${file.toString()}`)),
    });
  }

  for (const target of targets) {
    apiScheduler(target);
    await wait(60000);
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
            logger.error(
              `目标：${target}, 错误类型: ${e.name}, 错误信息: ${
                e.message
              }, 响应: ${JSON.stringify(e.response ?? {})}`,
            );
          }
        })();
        await wait(180000);
      }
    }
  }
})();
