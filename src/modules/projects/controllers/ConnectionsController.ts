import { Request, Response } from 'express';

import { prisma } from '@shared/prisma';

import { CreateConnectionService } from '../services/CreateConnectionService';
import { DeleteConnectionService } from '../services/DeleteConnectionService';

export class ConnectionsController {
  static async index(request: Request, response: Response): Promise<Response> {
    const connections = await prisma.connection.findMany({
      where: {
        project_id: String(request.headers['x-project-selected']),
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
      project_id: String(request.headers['x-project-selected']),
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
