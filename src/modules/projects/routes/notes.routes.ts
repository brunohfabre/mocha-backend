import { Router } from 'express';

import { NotesController } from '../controllers/NotesController';

const notesRouter = Router();

notesRouter.get('/', NotesController.index);
notesRouter.get('/:id', NotesController.show);
notesRouter.post('/', NotesController.create);
notesRouter.put('/:id', NotesController.update);
notesRouter.delete('/:id', NotesController.delete);

export { notesRouter };
