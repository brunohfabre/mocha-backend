import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  user_id: string;
  title: string;
}

interface IResponse {
  id: string;
  title: string;
  created_at: Date;
}

export class CreateProjectService {
  static async execute({ user_id, title }: IRequest): Promise<IResponse> {
    const projectWithSameName = await prisma.project.findFirst({
      where: {
        title,
        user_id,
      },
    });

    if (projectWithSameName) {
      throw new AppError('This project already exists');
    }

    const project = await prisma.project.create({
      data: {
        title,
        user_id,
      },
      select: {
        id: true,
        title: true,
        created_at: true,
      },
    });

    return project;
  }
}
