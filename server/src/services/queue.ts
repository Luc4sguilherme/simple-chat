import Bull, { Queue as IQueue } from 'bull';
import moment from 'moment';

import config from '~/config';

import { Chat } from '@src/clients/chat';
import logger from '@src/logger';

interface Option {
  attempts: number;
  backoff: number;
  delay: number;
}

interface Data {
  message: string;
}

interface Queues {
  bull: IQueue;
  name: string;
  options: Option;
  handle: (data: Data, chat: Chat) => Promise<void>;
}

const queues: Queues[] = [
  {
    bull: new Bull('chatMessage', {
      redis: {
        port: config.Redis.port,
        host: config.Redis.host,
      },
    }),
    name: 'chatMessage',
    options: {
      attempts: 5,
      backoff: Number(moment.duration(250, 'milliseconds')),
      delay: Number(moment.duration(750, 'milliseconds')),
    },
    async handle(data: Data, chat: Chat) {
      chat.broadcastEvent(data.message);
    },
  },
];

function add(name: string, data: Data) {
  const queue = queues.find(elem => elem.name === name);

  return queue?.bull.add(data, queue.options);
}

function process(chat: Chat) {
  return queues.forEach(queue => {
    queue.bull.process(15, ({ data }) => queue.handle(data, chat));

    queue.bull.on('failed', job => {
      logger.error(`There was an error in the queue ${job.queue.name}`);
    });
  });
}

export default {
  process,
  add,
};
