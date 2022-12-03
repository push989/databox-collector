import Databox, { PushRequest } from "databox";
import { appConfig } from "../../appConfig";
import Logger from "../../common/Logger";
import { DataboxMetric } from "./DataboxModels";

class DataboxIntegrationService {
  client = new Databox({
    push_token: appConfig.databoxPushToken,
  });

  public async pushMetrics(metrics: DataboxMetric[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const metricsRequest: PushRequest[] = metrics.map((metric) => ({
        key: metric.name,
        value: metric.value,
        date: metric.date?.toISOString(),
      }));

      this.client.insertAll(metricsRequest, (result) => {
        if (result.status === "OK") {
          Logger.log("databox_push_success", result);
          resolve();
        } else {
          Logger.logError("databox_push_error", result);
          reject(result);
        }
      });
    });
  }
}

export default new DataboxIntegrationService();
