import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

type IRequest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export class UpdateUserService {
  static async execute(data: IRequest) {
    const { id, first_name, last_name, email, phone } = data;

    const userExists = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new AppError('Email address or phone already used.');
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email,
        phone,
      },
    });

    return user;
  }
}
