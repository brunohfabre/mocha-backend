import { Request, Response } from 'express';

import { CreateUserService } from '../services/CreateUserService';
import { UpdateUserService } from '../services/UpdateUserService';

export class UsersController {
  static async create(request: Request, response: Response): Promise<Response> {
    const { first_name, last_name, email, password, phone } = request.body;

    const user = await CreateUserService.execute({
      first_name,
      last_name,
      email,
      password,
      phone,
    });

    const userWithoutPassword = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
    };

    return response.json(userWithoutPassword);
  }

  static async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { first_name, last_name, email, phone } = request.body;

    const user = await UpdateUserService.execute({
      id,
      first_name,
      last_name,
      email,
      phone,
    });

    const userWithoutPassword = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
    };

    return response.json(userWithoutPassword);
  }
}
