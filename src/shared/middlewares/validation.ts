import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { resolve } from 'path';
import { ObjectSchema, ValidationError } from 'yup';
import { ObjectShape } from 'yup/lib/object';

export const Segments = {
  BODY: 'body',
  HEADERS: 'headers',
  QUERY: 'query',
};

type SegmentField = {
  name: string;
  type: string;
  required: boolean;
  nullable: boolean;
};

type Field = {
  type: string;
  spec: {
    nullable: boolean;
    presence: string;
  };
};

type Data = {
  body?: ObjectSchema<ObjectShape>;
  headers?: ObjectSchema<ObjectShape>;
  query?: ObjectSchema<ObjectShape>;
};

export function validationMiddleware(data: Data) {
  return async (request: Request, response: Response, next: NextFunction) => {
    let validationErrors = {};
    let validationData = {};

    if (data.body) {
      try {
        const { fields } = data.body;

        const bodyFields: SegmentField[] = [];

        Object.keys(fields).forEach(item => {
          const field = fields[item] as Field;

          bodyFields.push({
            name: item,
            type: field.type,
            required: field.spec.presence === 'required',
            nullable: field.spec.nullable,
          });
        });

        validationData = {
          ...validationData,
          body: bodyFields,
        };

        await data.body.validate(request.body, {
          abortEarly: false,
        });
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors: { [key: string]: string } = {};

          err.inner.forEach(error => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });

          validationErrors = {
            ...validationErrors,
            body: errors,
          };
        }
      }
    }

    if (data.headers) {
      try {
        const { fields } = data.headers;

        const headersFields: SegmentField[] = [];

        Object.keys(fields).forEach(item => {
          const field = fields[item] as Field;

          headersFields.push({
            name: item,
            type: field.type,
            required: field.spec.presence === 'required',
            nullable: field.spec.nullable,
          });
        });

        validationData = {
          ...validationData,
          headers: headersFields,
        };

        await data.headers.validate(request.headers, {
          abortEarly: false,
        });
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors: { [key: string]: string } = {};

          err.inner.forEach(error => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });

          validationErrors = {
            ...validationErrors,
            headers: errors,
          };
        }
      }
    }

    if (data.query) {
      try {
        const { fields } = data.query;

        const queryFields: SegmentField[] = [];

        Object.keys(fields).forEach(item => {
          const field = fields[item] as Field;

          queryFields.push({
            name: item,
            type: field.type,
            required: field.spec.presence === 'required',
            nullable: field.spec.nullable,
          });
        });

        validationData = {
          ...validationData,
          query: queryFields,
        };

        await data.query.validate(request.query, {
          abortEarly: false,
        });
      } catch (err) {
        if (err instanceof ValidationError) {
          const errors: { [key: string]: string } = {};

          err.inner.forEach(error => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });

          validationErrors = {
            ...validationErrors,
            query: errors,
          };
        }
      }
    }

    const file = fs.readFileSync(
      resolve(__dirname, '..', '..', 'docs', 'docs.json'),
      {
        encoding: 'utf8',
      },
    );

    const newData = JSON.parse(file);

    newData.push(validationData);

    fs.writeFileSync(
      resolve(__dirname, '..', '..', 'docs', 'docs.json'),
      JSON.stringify({
        url: request.originalUrl,
        method: request.method,
        data: newData,
      }),
      {
        encoding: 'utf8',
      },
    );

    if (Object.keys(validationErrors).length) {
      return response
        .status(406)
        .json({ status: 'validation_error', data: validationErrors });
    }

    return next();
  };
}
