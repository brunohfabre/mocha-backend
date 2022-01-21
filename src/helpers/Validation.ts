import { NextFunction, Request, Response } from 'express';

export class Validation {
  static validateBody(schema: any): Promise<void> {
    return async (
      request: Request,
      response: Response,
      next: NextFunction,
    ): Promise<any> => {
      try {
        await schema.validate(request.body, {
          abortEarly: false,
        });

        return next();
      } catch (err: any) {
        const errors = {};

        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });

        return response.status(404).json({
          status: 'validation_error',
          errors,
        });
      }
    };
  }
}
