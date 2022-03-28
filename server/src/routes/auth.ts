import { celebrate, Joi, Segments } from 'celebrate';
import express from 'express';

import * as authController from '@src/controllers/authController';

const router = express.Router();

router.post(
  '/register',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  authController.register,
);

router.post(
  '/authenticate',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  authController.authenticate,
);

export { router };
