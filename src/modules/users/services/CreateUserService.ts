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

export class CreateUserService {
  static async execute({
    first_name,
    last_name,
    email,
    password,
    phone,
  }: IRequest): Promise<User> {
    const userExists = await prisma.user.findFirst({
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

    if (userExists) {
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
        projects: {
          create: {
            title: 'personal',
          },
        },
      },
    });

    return user;
  }
}
