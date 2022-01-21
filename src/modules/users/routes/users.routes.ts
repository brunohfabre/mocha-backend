import { Router } from 'express';

import { UsersController } from '../controllers/UsersController';

const usersRouter = Router();

usersRouter.post('/', UsersController.create);

export { usersRouter };
