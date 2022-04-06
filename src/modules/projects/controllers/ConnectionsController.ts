import { Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

import { CreateConnectionService } from '../services/CreateConnectionService';
import { DeleteConnectionService } from '../services/DeleteConnectionService';

export class ConnectionsController {
  static async index(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    const projectExists = await prisma.project.findFirst({
      where: {
        userId,
      },
    });

    if (!projectExists) {
      throw new AppError('Project do not exists');
    }

    const connections = await prisma.connection.findMany({
      where: {
        projectId: projectExists.id,
      },
    });

    return response.json(connections);
  }

  static async create(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { type, name, host, port, user, password } = request.body;

    const connection = await CreateConnectionService.execute({
      userId,
      type,
      name,
      host,
      port,
      user,
      password,
    });

    return response.json(connection);
  }

  static async delete(request: Request, response: Response): Promise<Response> {
    const { userId } = request;
    const { id } = request.params;

    await DeleteConnectionService.execute({ userId, id });

    return response.json({ id });
  }
}
