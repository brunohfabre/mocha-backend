import { Note } from '@prisma/client';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  user_id: string;
  id: string;
  title: string;
  content: string;
  project_id: string;
}

export class UpdateNoteService {
  static async execute({
    user_id,
    id,
    title,
    content,
    project_id,
  }: IRequest): Promise<Note> {
    const projectExists = await prisma.project.findFirst({
      where: {
        user_id,
        id: project_id,
      },
    });

    if (!projectExists) {
      throw new AppError('Project do not exists');
    }

    const noteExists = await prisma.note.findFirst({
      where: {
        id,
        project_id,
      },
    });

    if (!noteExists) {
      throw new AppError('Note do not exists');
    }

    const note = await prisma.note.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });

    return note;
  }
}
