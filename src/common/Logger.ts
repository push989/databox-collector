import pino from "pino";

class Logger {
  logger = pino(
    pino.transport({
      targets: [
        {
          level: "debug",
          target: "pino-pretty",
          options: {},
        },
        {
          target: "pino/file",
          options: { destination: "./logs", mkdir: true },
          level: "debug",
        },
      ],
    })
  );

  log(action: string, payload: object): void {
    this.logger.info({ action, payload });
  }

  error(action: string, payload: object): void {
    this.logger.error({ action, payload });
  }

  debug(action: string, payload: object): void {
    this.logger.debug({ action, payload });
  }
}

export default new Logger();
