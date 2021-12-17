import { Router } from 'express';

import { prisma } from '@shared/prisma';

import { UsersController } from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/', async (request, response) => {
  const users = await prisma.user.findMany();

  return response.json(users);
});

usersRouter.post('/', usersController.create);

export { usersRouter };
