import { Request, Response } from 'express';

import User from '@src/models/User';
import AuthService from '@src/services/auth';

import logger from '../logger';

export async function register(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (await User.findOne({ username })) {
      return res.status(400).send({ error: 'Username already exists!' });
    }

    const user = await User.create({ username, password });

    user.password = undefined;

    return res.send({
      user,
      token: AuthService.generateToken(user.id),
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error);
    }

    return res.status(500).send({ error: 'Registration failed!' });
  }
}

export async function authenticate(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(400).send({ error: 'User not found!' });
    }

    const isValidPassword = await AuthService.comparePasswords(
      password,
      user.password,
    );

    if (!isValidPassword) {
      return res.status(400).send({ error: 'Invalid password!' });
    }

    user.password = undefined;

    return res.send({
      user,
      token: AuthService.generateToken(user.id),
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error);
    }

    return res.status(500).send({ error: 'Authentication failed!' });
  }
}
