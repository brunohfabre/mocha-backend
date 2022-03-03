import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { resolve } from 'path';
import { ObjectSchema, ValidationError } from 'yup';
import { ObjectShape } from 'yup/lib/object';

type Segment = 'body' | 'headers' | 'query';

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

    const { isdocsrequest } = request.headers;

    const segments = Object.keys(Segments);

    for (const segmentItem of segments) {
      const segment: Segment = Segments[
        segmentItem as 'BODY' | 'HEADERS' | 'QUERY'
      ] as Segment;

      if (isdocsrequest) {
        const fields = data[segment]?.fields;

        if (fields && Object.keys(fields).length > 0) {
          const segmentFields: SegmentField[] = [];

          Object.keys(fields).forEach(item => {
            const field = fields[item] as Field;

            segmentFields.push({
              name: item,
              type: field.type,
              required: field.spec.presence === 'required',
              nullable: field.spec.nullable,
            });
          });

          validationData = {
            ...validationData,
            [segment]: segmentFields,
          };
        }
      } else {
        try {
          await data[segment]?.validate(request[segment], {
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
              [segment]: errors,
            };
          }
        }
      }
    }

    if (isdocsrequest) {
      const file = fs.readFileSync(
        resolve(__dirname, '..', '..', 'docs', 'docs.json'),
        {
          encoding: 'utf8',
        },
      );

      const fileData = JSON.parse(file);

      fileData.push({
        url: request.originalUrl,
        method: request.method,
        data: validationData,
      });

      fs.writeFileSync(
        resolve(__dirname, '..', '..', 'docs', 'docs.json'),
        JSON.stringify(fileData),
        {
          encoding: 'utf8',
        },
      );
    } else if (Object.keys(validationErrors).length) {
      return response
        .status(406)
        .json({ status: 'validation_error', data: validationErrors });
    }

    return next();
  };
}
