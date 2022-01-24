import { Router } from 'express';

import { ConnectionsController } from '../controllers/ConnectionsController';

const connectionsRouter = Router();

connectionsRouter.get('/', ConnectionsController.index);
connectionsRouter.post('/', ConnectionsController.create);

export { connectionsRouter };
