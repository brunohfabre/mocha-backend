import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';

import { connectionsRouter } from '@modules/projects/routes/connections.routes';
import { invitesRouter } from '@modules/projects/routes/invites.routes';
import { notesRouter } from '@modules/projects/routes/notes.routes';
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

// routes.get('/docs', (request, response) => {
//   return response.json(require('../../docs/docs.json'));
// });

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

routes.use(ensureAuthenticated);

// routes.get('/invites', async (request, response) => {
//   const { user_id } = request;

//   const invites = await prisma.invite.findMany({
//     where: {
//       to_id: user_id,
//       accepted: false,
//     },
//   });

//   return response.json(invites);
// });

// routes.post('/invites', async (request, response) => {
//   const { user_id } = request;
//   const { to } = request.body;

//   const invite = await prisma.invite.create({
//     data: {
//       from_id: user_id,
//       to_id: to,
//     },
//   });

//   return response.json(invite);
// });

// routes.put('/invites/:id', async (request, response) => {
//   const { user_id } = request;
//   const { id } = request.params;

//   // const invite = await prisma.invite.findFirst({
//   //   where: {
//   //     id,
//   //     fromId: userId,
//   //     accepted: false,
//   //   },
//   // });

//   const invite = await prisma.invite.update({
//     where: {
//       id,
//     },
//     data: { accepted: true },
//   });

//   if (!invite) {
//     return response.status(400).send('error');
//   }

//   await prisma.contact.createMany({
//     data: [
//       {
//         user_id,
//         contact_id: invite.from_id,
//       },
//       {
//         user_id: invite.from_id,
//         contact_id: user_id,
//       },
//     ],
//   });

//   return response.json(invite);
// });

// routes.get('/contacts', async (request, response) => {
//   const { user_id } = request;

//   const contacts = await prisma.contact.findMany({
//     where: {
//       user_id,
//     },
//     select: {
//       id: true,
//       contact: {
//         select: {
//           id: true,
//           first_name: true,
//           last_name: true,
//           email: true,
//           phone: true,
//           github_id: true,
//         },
//       },
//     },
//   });

//   return response.json(contacts);
// });

routes.use('/projects', projectsRouter);
routes.use('/invites', invitesRouter);
routes.use('/connections', connectionsRouter);
routes.use('/notes', notesRouter);

export { routes };
