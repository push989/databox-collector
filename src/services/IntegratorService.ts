import DataboxIntegrationService from "../integrations/databox/DataboxIntegrationService";
import CollectorService, { SyncOptions } from "./CollectorService";

class MainService {
  async integrate(syncOptions: SyncOptions[]) {
    const data = await CollectorService.collectData(syncOptions);

    return Promise.all(data.map(({ data }) => DataboxIntegrationService.pushMetrics(data)));
  }
}

export default new MainService();
