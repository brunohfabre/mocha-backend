import { Connection, ConnectionType } from '@prisma/client';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  userId: string;
  type: ConnectionType;
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  projectId: string;
}

export class CreateConnectionService {
  static async execute({
    userId,
    type,
    name,
    host,
    port,
    user,
    password,
    projectId,
  }: IRequest): Promise<Connection> {
    const projectExists = await prisma.project.findFirst({
      where: {
        userId,
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
        projectId,
      },
    });

    return connection;
  }
}
