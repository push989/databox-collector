/* eslint-disable @typescript-eslint/no-non-null-assertion */
const appConfig = {
  databoxPushToken: process.env.DATABOX_PUSH_TOKEN!,
  logLevel: parseInt(process.env.LOG_LEVEL!),
};

export { appConfig };
