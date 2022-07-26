import { Note } from '@prisma/client';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  user_id: string;
  title: string;
  content: string;
  project_id: string;
}

export class CreateNoteService {
  static async execute({
    user_id,
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

    const note = await prisma.note.create({
      data: {
        title,
        content,
        project_id,
      },
    });

    return note;
  }
}
