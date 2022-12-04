import pino from "pino";

class Logger {
  logger = pino(
    pino.transport({
      target: "pino/file",
      options: { destination: "./logs", mkdir: true },
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
