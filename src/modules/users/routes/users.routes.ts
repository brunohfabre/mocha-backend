import { Router } from 'express';
import { object, string } from 'yup';

import { Segments, validationMiddleware } from '@shared/middlewares/validation';

import { UsersController } from '../controllers/UsersController';

const usersRouter = Router();

usersRouter.post(
  '/',
  validationMiddleware({
    [Segments.BODY]: object({
      firstName: string().required(),
      lastName: string().required(),
      phone: string().required(),
      email: string().required().email(),
      password: string().required(),
    }),
  }),
  UsersController.create,
);

usersRouter.put(
  '/:id',
  validationMiddleware({
    [Segments.BODY]: object({
      firstName: string(),
      lastName: string(),
      phone: string(),
      email: string().email(),
    }),
  }),
  UsersController.update,
);

export { usersRouter };
