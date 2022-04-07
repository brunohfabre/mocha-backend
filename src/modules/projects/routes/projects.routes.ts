import { Router } from 'express';

import { ProjectsController } from '../controllers/ProjectsController';

const projectsRouter = Router();

projectsRouter.get('/', ProjectsController.index);

export { projectsRouter };
