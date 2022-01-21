import { Router } from 'express';

import { Validation } from '@helpers/Validation';

import { UsersController } from '../controllers/UsersController';
import { createUserDTO } from '../dtos/createUserDTO';

const usersRouter = Router();

usersRouter.post(
  '/',
  Validation.validateBody(createUserDTO),
  UsersController.create,
);

export { usersRouter };
