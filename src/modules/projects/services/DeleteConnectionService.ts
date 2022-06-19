import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  user_id: string;
  id: string;
}

export class DeleteConnectionService {
  static async execute({ user_id, id }: IRequest): Promise<void> {
    const connectionExists = await prisma.connection.findFirst({
      where: {
        id,
      },
    });

    if (!connectionExists) {
      throw new AppError('Connection do not exists.');
    }

    const projectExists = await prisma.project.findFirst({
      where: {
        id: connectionExists.project_id,
        user_id,
      },
    });

    if (!projectExists) {
      throw new AppError('Project do not exists.');
    }

    await prisma.connection.delete({
      where: {
        id,
      },
    });
  }
}
