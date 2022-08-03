import { Router } from 'express';

import { MembersController } from '../controllers/MembersController';

const membersRouter = Router();

membersRouter.delete('/:id', MembersController.delete);

export { membersRouter };
