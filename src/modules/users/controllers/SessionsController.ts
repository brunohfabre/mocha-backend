import { Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

import { AuthenticateUserService } from '../services/AuthenticateUserService';

export class SessionsController {
  static async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    if (!user_id) {
      throw new AppError('Token is missing to fetch user data.');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
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
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
    };

    return response.json({ user: userWithoutPassword, token });
  }
}
