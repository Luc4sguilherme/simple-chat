import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import AuthService from '@src/services/auth';

import logger from '../logger';

export function authMiddleware(
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void,
): void {
  try {
    const authHeader = socket.handshake.auth.token;

    if (!authHeader) {
      next(new Error('No token provided!'));
      return;
    }

    const parts = authHeader.split(' ');

    if (!(parts.length === 2)) {
      next(new Error('Token error!'));
      return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      next(new Error('Token malformatted!'));
      return;
    }

    const claims = AuthService.decodeToken(token as string);

    // @ts-ignore
    socket.request.context = { userId: claims.sub };

    next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error);
    }

    next(new Error('Error verifying token'));
  }
}
