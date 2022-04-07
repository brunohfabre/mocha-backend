import { Request, Response } from 'express';

import { CreateUserService } from '../services/CreateUserService';
import { UpdateUserService } from '../services/UpdateUserService';

export class UsersController {
  static async create(request: Request, response: Response): Promise<Response> {
    const { firstName, lastName, email, password, phone } = request.body;

    const user = await CreateUserService.execute({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    const userWithoutPassword = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
    };

    return response.json(userWithoutPassword);
  }

  static async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { firstName, lastName, email, phone } = request.body;

    const user = await UpdateUserService.execute({
      id,
      firstName,
      lastName,
      email,
      phone,
    });

    const userWithoutPassword = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    };

    return response.json(userWithoutPassword);
  }
}
