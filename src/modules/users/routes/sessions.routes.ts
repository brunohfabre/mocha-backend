import { Router } from 'express';

import { ensureAuthenticated } from '@shared/middlewares/ensureAuthenticated';

import { SessionsController } from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.get('/', ensureAuthenticated, sessionsController.show);
sessionsRouter.post('/', sessionsController.create);

export { sessionsRouter };
