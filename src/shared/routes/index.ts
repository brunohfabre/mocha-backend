import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';

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

routes.use('/connections', connectionsRouter);
routes.use('/projects', projectsRouter);

export { routes };
