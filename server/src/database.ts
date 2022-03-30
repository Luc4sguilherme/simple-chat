import mongoose, { Mongoose } from 'mongoose';

import config from '~/config';

export const connect = async (): Promise<Mongoose> =>
  await mongoose.connect(config.Database.mongoUrl);

export const close = (): Promise<void> => mongoose.connection.close();
