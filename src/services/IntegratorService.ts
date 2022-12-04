import Logger from "../common/Logger";
import DataboxIntegrationService from "../integrations/databox/DataboxIntegrationService";
import CollectorService, { SyncOptions } from "./CollectorService";

class MainService {
  async integrate(syncOptions: SyncOptions[]) {
    const data = await CollectorService.collectData(syncOptions);

    return Promise.all(
      data.map(async ({ dataSource, data }) => {
        try {
          await DataboxIntegrationService.pushMetrics(data);

          Logger.log("databox_send", {
            serviceName: dataSource,
            metrics: data,
            numberOfKpis: data.length,
            success: true,
          });
        } catch (error) {
          Logger.error("databox_send", {
            serviceName: dataSource,
            metrics: data,
            numberOfKpis: data.length,
            success: false,
            error: (error as Error)?.message ?? error,
          });
        }
      })
    );
  }
}

export default new MainService();
