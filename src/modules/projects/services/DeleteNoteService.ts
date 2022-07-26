import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  user_id: string;
  id: string;
}

export class DeleteNoteService {
  static async execute({ user_id, id }: IRequest): Promise<void> {
    const noteExists = await prisma.note.findFirst({
      where: {
        id,
      },
    });

    if (!noteExists) {
      throw new AppError('Note do not exists.');
    }

    const projectExists = await prisma.project.findFirst({
      where: {
        id: noteExists.project_id,
        user_id,
      },
    });

    if (!projectExists) {
      throw new AppError('Project do not exists.');
    }

    await prisma.note.delete({
      where: {
        id,
      },
    });
  }
}
