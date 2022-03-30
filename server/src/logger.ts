import pino from 'pino';

import config from '~/config';

export default pino(
  {
    enabled: config.App.logger.enabled,
    level: config.App.logger.level,
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
