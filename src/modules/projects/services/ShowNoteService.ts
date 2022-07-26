import { Note } from '@prisma/client';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  user_id: string;
  id: string;
  project_id: string;
}

export class ShowNoteService {
  static async execute({ user_id, id, project_id }: IRequest): Promise<Note> {
    const projectExists = await prisma.project.findFirst({
      where: {
        id: project_id,
        user_id,
      },
    });

    if (!projectExists) {
      throw new AppError('Project do not exists.');
    }

    const note = await prisma.note.findFirst({
      where: {
        id,
        project_id,
      },
    });

    if (!note) {
      throw new AppError('Note do not exists.');
    }

    return note;
  }
}
