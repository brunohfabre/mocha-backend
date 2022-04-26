import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  id: string;
}

export class DeleteProjectService {
  static async execute({ id }: IRequest): Promise<void> {
    const projectExists = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!projectExists) {
      throw new AppError('This project not exists');
    }

    await prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
