import { CaptchaError } from '../src/errors';
import log4js from 'log4js';
import { wait } from '../src/utils/wait';

(async function debug() {
  log4js.configure({
    appenders: {
      out: { type: 'stdout' },
    },
    categories: {
      default: { appenders: ['out'], level: 'debug' },
    },
  });

  const name = process.argv[2];
  const logger = log4js.getLogger(name);
  const api = await import(`../src/api/${name}`);
  const target = generatePhoneNumber();
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
        }, 响应: ${JSON.stringify(e.response.body ?? {})}
        堆栈: ${e.stack}`,
      );
    }
  })();
})();

function generatePhoneNumber() {
  let phoneNumber = '1338004';
  for (let i = 0; i < 4; i++) {
    phoneNumber += generateRandomInt(0, 9);
  }
  return phoneNumber;
}

function generateRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
