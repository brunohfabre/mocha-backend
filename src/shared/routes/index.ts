import { Router } from 'express';
import { object, string, number } from 'yup';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';
import { Segments, validationMiddleware } from '@shared/middlewares/validation';

import { connectionsRouter } from '@modules/projects/routes/connections.routes';
import { sessionsRouter } from '@modules/users/routes/sessions.routes';
import { usersRouter } from '@modules/users/routes/users.routes';

const routes = Router();

const testValidation = {
  [Segments.BODY]: object({
    firstName: string().required(),
    lastName: string().required(),
    age: number().required(),
  }),
  [Segments.HEADERS]: object({
    'x-total-count': string().required(),
  }),
  [Segments.QUERY]: object({
    page: number().required(),
    search: string(),
  }),
};

routes.post(
  '/testvalidation',
  validationMiddleware(testValidation),
  (request, response) => {
    return response.json({ ok: 'test' });
  },
);

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

routes.use(ensureAuthenticated);

routes.use('/connections', connectionsRouter);

routes.get('/test', (request, response) => {
  return response.json({ ok: 'test' });
});

export { routes };
