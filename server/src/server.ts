import { errors } from 'celebrate';
import cors from 'cors';
import express, { Application, Express } from 'express';
import expressPino from 'express-pino-logger';
import helmet from 'helmet';
import http from 'http';

import { Chat } from '@src/clients/chat';
import * as database from '@src/database';
import { router as routerAuth } from '@src/routes/auth';
import queue from '@src/services/queue';

import logger from './logger';

export class Server {
  private server?: http.Server;
  private app: Express;
  private chat: Chat;

  constructor(private port = 3333) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.chat = new Chat(this.server);
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupChat();
    this.setupQueue();
    this.setupRoutes();
    this.setupErrors();

    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(
      expressPino({
        logger,
      }),
    );
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: '*',
      }),
    );
  }

  private setupChat() {
    this.chat.init();
  }

  private setupRoutes() {
    this.app.use('/auth', routerAuth);
  }

  private setupErrors() {
    this.app.use(errors());
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  private setupQueue() {
    queue.process(this.chat);
  }

  public getApp(): Application {
    return this.app;
  }

  public async close(): Promise<void> {
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close(err => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }

  public start(): void {
    this.server?.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }
}
