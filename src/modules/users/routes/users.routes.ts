import { Router } from 'express';

import { prisma } from '@shared/prisma';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const users = await prisma.user.findMany();

  return response.json(users);
});

export { usersRouter };
