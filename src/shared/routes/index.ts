import { Router } from 'express';

// import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';

// import { notesRouter } from '@modules/notes/routes/notes.routes';
// import { sessionsRouter } from '@modules/users/routes/sessions.routes';
import { usersRouter } from '@modules/users/routes/users.routes';

const routes = Router();

routes.use('/users', usersRouter);

// routes.use('/sessions', sessionsRouter);

// routes.use(ensureAuthenticated);

// routes.use('/notes', notesRouter);

export { routes };
