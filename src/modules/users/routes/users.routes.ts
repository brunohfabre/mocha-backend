import { Router } from 'express';

import { prisma } from '@shared/prisma';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const users = await prisma.user.findMany();

  return response.json(users);
});

usersRouter.post('/', UsersController.create);

export { usersRouter };
