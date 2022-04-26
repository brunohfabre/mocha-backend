import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';
import { prisma } from '@shared/prisma';

import { connectionsRouter } from '@modules/projects/routes/connections.routes';
import { projectsRouter } from '@modules/projects/routes/projects.routes';
import { sessionsRouter } from '@modules/users/routes/sessions.routes';
import { usersRouter } from '@modules/users/routes/users.routes';

const routes = Router();

// const testValidation = {
//   [Segments.BODY]: object({
//     firstName: string().required(),
//     lastName: string().required(),
//     age: number().required(),
//   }),
//   [Segments.HEADERS]: object({
//     'x-total-count': string().required(),
//   }),
//   [Segments.QUERY]: object({
//     page: number().required(),
//     search: string(),
//   }),
// };

routes.get('/docs', (request, response) => {
  return response.json(require('../../docs/docs.json'));
});

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

routes.use(ensureAuthenticated);

routes.get('/invites', async (request, response) => {
  const { userId } = request;

  const invites = await prisma.invite.findMany({
    where: {
      toId: userId,
      accepted: false,
    },
  });

  return response.json(invites);
});

routes.post('/invites', async (request, response) => {
  const { userId } = request;
  const { to } = request.body;

  const invite = await prisma.invite.create({
    data: {
      fromId: userId,
      toId: to,
    },
  });

  return response.json(invite);
});

routes.put('/invites/:id', async (request, response) => {
  const { userId } = request;
  const { id } = request.params;

  // const invite = await prisma.invite.findFirst({
  //   where: {
  //     id,
  //     fromId: userId,
  //     accepted: false,
  //   },
  // });

  const invite = await prisma.invite.update({
    where: {
      id,
    },
    data: { accepted: true },
  });

  if (!invite) {
    return response.status(400).send('error');
  }

  await prisma.contact.createMany({
    data: [
      {
        userId,
        contactId: invite.fromId,
      },
      {
        userId: invite.fromId,
        contactId: userId,
      },
    ],
  });

  return response.json(invite);
});

routes.get('/contacts', async (request, response) => {
  const { userId } = request;

  const contacts = await prisma.contact.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          githubId: true,
        },
      },
    },
  });

  return response.json(contacts);
});

routes.use('/connections', connectionsRouter);
routes.use('/projects', projectsRouter);

export { routes };
