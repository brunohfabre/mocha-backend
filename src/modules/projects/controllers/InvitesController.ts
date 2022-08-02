import { Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';
import { prisma } from '@shared/prisma';

export class InvitesController {
  static async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const invites = await prisma.invite.findMany({
      where: {
        to_id: user_id,
        accepted: false,
      },
    });

    return response.json(invites);
  }

  static async create(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;
    const { to } = request.body;
    const project_id = String(request.headers['x-project-selected']);

    const invite = await prisma.invite.create({
      data: {
        from_id: user_id,
        to_id: to,
        project_id,
      },
    });

    return response.json(invite);
  }

  static async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const inviteExists = await prisma.invite.findFirst({
      where: {
        id,
      },
    });

    if (!inviteExists) {
      throw new AppError('Invite not exists.');
    }

    const [invite] = await prisma.$transaction([
      prisma.invite.update({
        where: {
          id,
        },
        data: {
          accepted: true,
        },
      }),
      prisma.member.create({
        data: {
          project_id: inviteExists.project_id,
          user_id: inviteExists.to_id,
        },
      }),
    ]);

    return response.json(invite);
  }

  static async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    await prisma.invite.delete({
      where: {
        id,
      },
    });

    return response.send().status(204);
  }
}
