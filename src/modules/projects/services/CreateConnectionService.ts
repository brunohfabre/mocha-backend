import { Connection, ConnectionType } from '@prisma/client';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  user_id: string;
  type: ConnectionType;
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

export class CreateConnectionService {
  static async execute({
    user_id,
    type,
    name,
    host,
    port,
    user,
    password,
  }: IRequest): Promise<Connection> {
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

    return connection;
  }
}
