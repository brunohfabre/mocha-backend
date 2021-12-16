export const authConfig = {
  jwt: {
    secret: process.env.SECRET || '',
    expiresIn: process.env.EXPIRES_IN || '',
  },
};
