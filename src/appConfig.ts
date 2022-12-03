/* eslint-disable @typescript-eslint/no-non-null-assertion */
const appConfig = {
  port: parseInt(process.env.PORT!),
  databoxPushToken: process.env.DATABOX_PUSH_TOKEN!,
  logLevel: parseInt(process.env.LOG_LEVEL!),
  redditClientId: process.env.REDDIT_CLIENT_ID!,
  redditClientSecret: process.env.REDDIT_CLIENT_SECRET!,
};

export { appConfig };
