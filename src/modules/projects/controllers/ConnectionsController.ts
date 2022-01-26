import { Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

import { CreateConnectionService } from '../services/CreateConnectionService';
import { DeleteConnectionService } from '../services/DeleteConnectionService';

export class ConnectionsController {
  static async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const projectExists = await prisma.project.findFirst({
      where: {
        user_id,
      },
    });

    if (!projectExists) {
      throw new AppError('Project do not exists');
    }

    const connections = await prisma.connection.findMany({
      where: {
        project_id: projectExists.id,
      },
    });

    return response.json(connections);
  }

  static async create(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;
    const { type, name, host, port, user, password } = request.body;

    const connection = await CreateConnectionService.execute({
      user_id,
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
    const { user_id } = request;
    const { id } = request.params;

    await DeleteConnectionService.execute({ user_id, id });

    return response.json({ id });
  }
}
