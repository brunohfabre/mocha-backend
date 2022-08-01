import { Request, Response } from 'express';

import { prisma } from '@shared/prisma';

import { CreateNoteService } from '../services/CreateNoteService';
import { DeleteNoteService } from '../services/DeleteNoteService';
import { ShowNoteService } from '../services/ShowNoteService';
import { UpdateNoteService } from '../services/UpdateNoteService';

export class NotesController {
  static async index(request: Request, response: Response): Promise<Response> {
    const project_id = String(request.headers['x-project-selected']);

    const notes = await prisma.note.findMany({
      where: {
        project_id,
      },
    });

    return response.json(notes);
  }

  static async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;
    const { id } = request.params;
    const project_id = String(request.headers['x-project-selected']);

    const note = await ShowNoteService.execute({
      user_id,
      id,
      project_id,
    });

    return response.json(note);
  }

  static async create(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;
    const { title, content } = request.body;
    const project_id = String(request.headers['x-project-selected']);

    const note = await CreateNoteService.execute({
      user_id,
      title,
      content,
      project_id,
    });

    return response.json(note);
  }

  static async update(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;
    const { title, content } = request.body;
    const { id } = request.params;
    const project_id = String(request.headers['x-project-selected']);

    const note = await UpdateNoteService.execute({
      user_id,
      id,
      title,
      content,
      project_id,
    });

    return response.json(note);
  }

  static async delete(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;
    const { id } = request.params;

    await DeleteNoteService.execute({ user_id, id });

    return response.json({ id });
  }
}
