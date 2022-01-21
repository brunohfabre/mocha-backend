import { object, string } from 'yup';

export const createUserDTO = object({
  firstName: string().required(),
  lastName: string().required(),
  phone: string().required(),
  email: string().required().email(),
  password: string().required(),
});
