import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

class CreateUserService {
  public async execute({
    first_name,
    last_name,
    email,
    password,
    phone,
  }: IRequest): Promise<User> {
    const checkUserExists = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            phone,
          },
        ],
      },
    });

    if (checkUserExists) {
      throw new AppError('Email address or phone already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        phone,
      },
    });

    return user;
  }
}

export default new CreateUserService();
