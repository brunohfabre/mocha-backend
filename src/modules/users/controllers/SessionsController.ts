import { Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

import { AuthenticateUserService } from '../services/AuthenticateUserService';

export class SessionsController {
  static async show(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    if (!userId) {
      throw new AppError('Token is missing to fetch user data.');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return response.json(user);
  }

  static async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const { user, token } = await AuthenticateUserService.execute({
      email,
      password,
    });

    const userWithoutPassword = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };

    return response.json({ user: userWithoutPassword, token });
  }
}
