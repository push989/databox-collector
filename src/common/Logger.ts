import { appConfig } from "../appConfig";

class Logger {
  public log(action: string, payload: object): void {
    if (appConfig.logLevel > 0) {
      return;
    }
    console.log(action, payload);
  }

  public logError(action: string, payload: object): void {
    if (appConfig.logLevel < 1) {
      console.error(action, payload);
    }
  }
}

export default new Logger();
