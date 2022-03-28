import config from 'config';
import mongoose, { Mongoose } from 'mongoose';

export const connect = async (): Promise<Mongoose> =>
  await mongoose.connect(config.get('Database.mongoUrl'));

export const close = (): Promise<void> => mongoose.connection.close();
