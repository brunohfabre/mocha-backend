import { Request, Response } from 'express';

import { CreateUserService } from '../services/CreateUserService';

export class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { first_name, last_name, email, password, phone } = request.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      first_name,
      last_name,
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
