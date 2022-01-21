import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';

import { SessionsController } from '../controllers/SessionsController';

const sessionsRouter = Router();

sessionsRouter.get('/', ensureAuthenticated, SessionsController.show);
sessionsRouter.post('/', SessionsController.create);

export { sessionsRouter };
