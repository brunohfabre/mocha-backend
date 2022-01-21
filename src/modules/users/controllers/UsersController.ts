import { Request, Response } from 'express';

import { CreateUserService } from '../services/CreateUserService';

export class UsersController {
  static async create(request: Request, response: Response): Promise<Response> {
    const { firstName, lastName, email, password, phone } = request.body;

    const user = await CreateUserService.execute({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
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
