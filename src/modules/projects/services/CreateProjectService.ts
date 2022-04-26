import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  userId: string;
  title: string;
}

interface IResponse {
  id: string;
  title: string;
  createdAt: Date;
}

export class CreateProjectService {
  static async execute({ userId, title }: IRequest): Promise<IResponse> {
    const projectWithSameName = await prisma.project.findFirst({
      where: {
        title,
        userId,
      },
    });

    if (projectWithSameName) {
      throw new AppError('This project already exists');
    }

    const project = await prisma.project.create({
      data: {
        title,
        userId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return project;
  }
}
