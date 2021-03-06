import * as dotenv from 'dotenv';

dotenv.config();

export default {
  App: {
    port: Number(process.env.APP_PORT) || 3333,
    logger: {
      enabled: Boolean(process.env.APP_LOGGER_ENABLED),
      level: String(process.env.APP_LOGGER_LEVEL),
    },
  },

  Database: {
    mongoUrl: String(process.env.MONGO_URL),
  },

  Auth: {
    secret: String(process.env.JWT_SECRET),
    tokenExpiresIn: Number(process.env.TOKEN_EXPIRES_IN),
  },

  Redis: {
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT),
  },
};
