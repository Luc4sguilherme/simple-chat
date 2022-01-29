import config from 'config';
import pino from 'pino';

export default pino(
  {
    enabled: config.get('App.logger.enabled'),
    level: config.get('App.logger.level'),
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'yyyy-dd-mm, h:MM:ss TT',
      },
    },
  },
  pino.destination(`./logger.log`),
);
