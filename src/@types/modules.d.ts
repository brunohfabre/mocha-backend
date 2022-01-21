declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;

    DATABASE_URL: string;

    SECRET: string;
    EXPIRES_IN: string;
  }
}
