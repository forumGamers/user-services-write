export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IMAGEKIT_PRIVATE_KEY: string;
      IMAGEKIT_PUBLIC_KEY: string;
      IMAGEKIT_ENDPOINT_URL: string;
      CORS_LIST: string;
      SECRET: string;
      SERVICE_SECRET: string;
      ENCRYPTION_KEY: string;
      CAPTCHA_SERVER_KEY: string;
      GOOGLE_OAUTH_CLIENTID: string;
      GOOGLE_OAUTH_CLIENT_SECRET: string;
      TS_NODE_IGNORE_DIAGNOSTICS: string;
      RABBITMQURL: string;
    }
  }
}
