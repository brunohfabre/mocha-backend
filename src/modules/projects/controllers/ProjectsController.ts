import { Request, Response } from 'express';

import { prisma } from '@shared/prisma';

import { CreateProjectService } from '../services/CreateProjectService';
import { DeleteProjectService } from '../services/DeleteProjectService';

export class ProjectsController {
  static async index(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return response.json(projects);
  }

  static async create(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { title } = request.body;

    const project = await CreateProjectService.execute({ userId, title });

    return response.json(project);
  }

  static async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    await DeleteProjectService.execute({ id });

    return response.json(true);
  }
}
