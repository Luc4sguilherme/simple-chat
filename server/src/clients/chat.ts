import http from 'http';
import { Server, Socket } from 'socket.io';

import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import queue from '@src/services/queue';

export class Chat {
  private io: Server;
  private clientsCount: number;

  constructor(private httpServer?: http.Server) {
    this.io = new Server(this.httpServer, {
      cors: {
        origin: '*',
      },
    });

    this.clientsCount = 0;
    this.io.use(authMiddleware);
  }

  init() {
    this.setupEvents();
  }

  private setupEvents() {
    this.clientConnectEvent();
    this.errorEvent();
  }

  broadcastEvent(message: string) {
    logger.info('send broadcast message');
    this.io.emit('broadcast', message);
  }

  private clientConnectHandler(client: Socket) {
    logger.info(`client ID:${client.id} connected`);

    this.clientsCount++;

    this.clientsCountEvent();
    this.clientDisconnectEvent(client);
    this.clientMessageEvent(client);
  }

  private clientConnectEvent() {
    this.io.on('connection', (client: Socket) => {
      this.clientConnectHandler(client);
    });
  }

  private clientDisconnectHandler(client: Socket) {
    logger.info(`client ID:${client.id} disconnected`);

    if (this.clientsCount > 0) {
      this.clientsCount--;
    }

    this.clientsCountEvent();
  }

  private clientDisconnectEvent(client: Socket) {
    client.on('disconnect', () => {
      this.clientDisconnectHandler(client);
    });
  }

  private clientMessageHandler(message: string, cliendID: string) {
    logger.info(`received a message from the client id: ${cliendID}`);
    queue.add('chatMessage', { message });
  }

  clientMessageEvent(client: Socket) {
    client.on('message', (message: string) => {
      this.clientMessageHandler(message, client.id);
    });
  }

  public getQuantityClientsConnected(): number {
    return this.clientsCount;
  }

  private clientsCountHandler() {
    const quantityClients = this.getQuantityClientsConnected();

    logger.info(`${quantityClients} client(s) connected`);

    return quantityClients;
  }

  private clientsCountEvent() {
    this.io.emit('count', this.clientsCountHandler());
  }

  private errorHandler(error: Error) {
    logger.error(error.message);
  }

  private errorEvent() {
    this.io.on('error', (error: Error) => {
      this.errorHandler(error);
    });
  }
}
