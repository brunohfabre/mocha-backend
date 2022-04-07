import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

type IRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export class UpdateUserService {
  static async execute(data: IRequest) {
    const { id, firstName, lastName, email, phone } = data;

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
        firstName,
        lastName,
        email,
        phone,
      },
    });

    return user;
  }
}
