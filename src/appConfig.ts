const appConfig = {
  port: parseInt(process.env.PORT!),
  databoxPushToken: process.env.DATABOX_PUSH_TOKEN!,
  logLevel: parseInt(process.env.LOG_LEVEL!),
  redditAuthUrl: process.env.REDDIT_AUTH_URL!,
  redditClientId: process.env.REDDIT_CLIENT_ID!,
  redditClientSecret: process.env.REDDIT_CLIENT_SECRET!,
  redditBaseUrl: process.env.REDDIT_BASE_URL!,
  server: process.env.SERVER! === "true",
  processor: process.env.PROCESSOR! === "true",
};

export { appConfig };
