import { Request, Response } from 'express';

import { prisma } from '@shared/prisma';

import { CreateProjectService } from '../services/CreateProjectService';
import { DeleteProjectService } from '../services/DeleteProjectService';

export class ProjectsController {
  static async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const projects = await prisma.project.findMany({
      where: {
        user_id,
      },
      select: {
        id: true,
        title: true,
        created_at: true,
        is_default: true,
      },
    });

    return response.json(projects);
  }

  static async create(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;
    const { title } = request.body;

    const project = await CreateProjectService.execute({ user_id, title });

    return response.json(project);
  }

  static async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    await DeleteProjectService.execute({ id });

    return response.json(true);
  }
}
