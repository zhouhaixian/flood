import log4js from 'log4js';

if (process.env['NODE_ENV'] === 'production') {
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
} else {
  log4js.configure({
    appenders: {
      out: { type: 'stdout' },
    },
    categories: {
      default: { appenders: ['out'], level: 'debug' },
    },
  });
}

export default log4js;
