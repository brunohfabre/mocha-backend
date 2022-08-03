import { Request, Response } from 'express';

import { prisma } from '@shared/prisma';

export class MembersController {
  static async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    await prisma.member.delete({
      where: {
        id,
      },
    });

    return response.send().status(204);
  }
}
