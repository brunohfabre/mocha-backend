import { Router } from 'express';

import { InvitesController } from '../controllers/InvitesController';

const invitesRouter = Router();

invitesRouter.get('/', InvitesController.index);
invitesRouter.post('/', InvitesController.create);
invitesRouter.put('/:id', InvitesController.update);
invitesRouter.delete('/:id', InvitesController.delete);

export { invitesRouter };
