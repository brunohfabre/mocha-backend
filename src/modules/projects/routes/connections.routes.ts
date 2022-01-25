import { Router } from 'express';

import { ConnectionsController } from '../controllers/ConnectionsController';

const connectionsRouter = Router();

connectionsRouter.get('/', ConnectionsController.index);
connectionsRouter.post('/', ConnectionsController.create);
connectionsRouter.delete('/:id', ConnectionsController.delete);

export { connectionsRouter };
