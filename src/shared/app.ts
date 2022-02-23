import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { ValidationError } from 'yup';

import { AppError } from './errors/AppError';
import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',

      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',

    message: 'Internal server error.',
  });
});

export { app };
