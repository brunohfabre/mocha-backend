import { NextFunction, Request, Response, Router } from 'express';
import fs from 'fs';
import { resolve } from 'path';
import { object, string, number } from 'yup';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';
import { Segments, validationMiddleware } from '@shared/middlewares/validation';

import { connectionsRouter } from '@modules/projects/routes/connections.routes';
import { sessionsRouter } from '@modules/users/routes/sessions.routes';
import { usersRouter } from '@modules/users/routes/users.routes';

function testMiddleware(schema: any) {
  return (request: Request, response: Response, next: NextFunction) => {
    fs.appendFileSync(
      resolve(__dirname, '..', '..', 'docs.txt'),
      `${request.method} | ${request.originalUrl} | ${JSON.stringify(
        Object.keys(schema.fields).map(field => ({
          field,
          type: schema.fields[field].type,
          required: schema.fields[field].spec.presence === 'required',
          nullable: schema.fields[field].spec.nullable,
        })),
      )}\n`,
    );

    next();
  };
}

const routes = Router();

const testValidation = {
  [Segments.BODY]: object({
    firstName: string().required(),
    lastName: string().required(),
    age: number().required(),
  }),
  [Segments.HEADERS]: object({
    authorization: string().required(),
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

routes.get(
  '/test',
  testMiddleware(
    object({
      name: string().required(),
      age: number(),
    }),
  ),
  (request, response) => {
    return response.json({ ok: 'test' });
  },
);

export { routes };
