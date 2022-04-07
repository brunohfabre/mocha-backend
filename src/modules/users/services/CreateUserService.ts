import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

interface IRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export class CreateUserService {
  static async execute({
    firstName,
    lastName,
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
        firstName,
        lastName,
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
