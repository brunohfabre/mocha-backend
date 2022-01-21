import { object, string } from 'yup';

export const createUserDTO = object({
  first_name: string().required(),
  last_name: string().required(),
  phone: string().required(),
  email: string().required().email(),
  password: string().required(),
});
