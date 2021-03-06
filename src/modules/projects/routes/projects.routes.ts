import { Router } from 'express';

import { ProjectsController } from '../controllers/ProjectsController';

const projectsRouter = Router();

projectsRouter.get('/', ProjectsController.index);
projectsRouter.get('/:id', ProjectsController.show);
projectsRouter.post('/', ProjectsController.create);
projectsRouter.delete('/:id', ProjectsController.delete);

export { projectsRouter };
