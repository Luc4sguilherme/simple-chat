import http from 'http';
import { Server, Socket } from 'socket.io';

import logger from '@src/logger';
import queue from '@src/services/queue';

export class Chat {
  private io: Server;

  constructor(private httpServer?: http.Server) {
    this.io = new Server(this.httpServer, {
      cors: {
        origin: '*',
      },
    });
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

    this.clientsCountEvent();
    this.clientDisconnectEvent(client);
    this.clientMessageEvent(client);
  }

  private clientConnectEvent() {
    this.io.on('connection', client => {
      this.clientConnectHandler(client);
    });
  }

  private clientDisconnectHanlder(client: Socket) {
    logger.info(`client ID:${client.id} disconnected`);
    this.clientsCountEvent();
  }

  private clientDisconnectEvent(client: Socket) {
    client.on('disconnect', () => {
      this.clientDisconnectHanlder(client);
    });
  }

  private clientMessageHandler(message: string, cliendID: string) {
    logger.info(`received a message from the client id: ${cliendID}`);
    queue.add('chatMessage', { message });
  }

  clientMessageEvent(client: Socket) {
    client.on('message', message => {
      this.clientMessageHandler(message, client.id);
    });
  }

  public getQuantityClientsConnected() {
    return this.io.engine.clientsCount;
  }

  private clientsCountHandler() {
    const quantityClients = this.getQuantityClientsConnected();

    logger.info(`${quantityClients} client(s) connected`);
  }

  private clientsCountEvent() {
    this.clientsCountHandler();
    this.io.emit('count', this.getQuantityClientsConnected());
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
