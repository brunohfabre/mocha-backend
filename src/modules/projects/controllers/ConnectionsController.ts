import { Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

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

    const projectExists = await prisma.project.findFirst({
      where: {
        user_id,
      },
    });

    if (!projectExists) {
      throw new AppError('Project do not exists');
    }

    const connection = await prisma.connection.create({
      data: {
        type,
        name,
        host,
        port,
        user,
        password,
        project_id: projectExists.id,
      },
    });

    return response.json(connection);
  }

  static async delete(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;
    const { id } = request.params;

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
        id: connectionExists.project_id,
        user_id,
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

    return response.json({ id });
  }
}
