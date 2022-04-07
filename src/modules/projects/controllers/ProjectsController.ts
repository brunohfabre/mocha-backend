import { Request, Response } from 'express';

import { prisma } from '@shared/prisma';

// import { CreateConnectionService } from '../services/CreateConnectionService';
// import { DeleteConnectionService } from '../services/DeleteConnectionService';

export class ProjectsController {
  static async index(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
    });

    return response.json(projects);
  }
}
