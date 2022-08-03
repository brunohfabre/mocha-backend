import { Router } from 'express';
import { object, string } from 'yup';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';
import { Segments, validationMiddleware } from '@shared/middlewares/validation';

import { UsersController } from '../controllers/UsersController';

const usersRouter = Router();

usersRouter.post(
  '/',
  validationMiddleware({
    [Segments.BODY]: object({
      first_name: string().required(),
      last_name: string().required(),
      phone: string().required(),
      email: string().required().email(),
      password: string().required(),
    }),
  }),
  UsersController.create,
);

usersRouter.use(ensureAuthenticated);

usersRouter.get('/', UsersController.index);

usersRouter.put(
  '/:id',
  validationMiddleware({
    [Segments.BODY]: object({
      first_name: string(),
      last_name: string(),
      phone: string(),
      email: string().email(),
    }),
  }),
  UsersController.update,
);

export { usersRouter };
