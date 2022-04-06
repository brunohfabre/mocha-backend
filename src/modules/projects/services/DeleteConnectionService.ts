import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  userId: string;
  id: string;
}

export class DeleteConnectionService {
  static async execute({ userId, id }: IRequest): Promise<void> {
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
        id: connectionExists.projectId,
        userId,
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
