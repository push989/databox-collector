import Logger from "../common/Logger";
import DataboxIntegrationService from "../integrations/databox/DataboxIntegrationService";
import { DataboxMetric } from "../integrations/databox/DataboxModels";
import CollectorService from "./collector/CollectorService";
import { IntegrationOptions } from "./IntegrationModels";

class IntegrationService {
  async integrate(integrationOptions: IntegrationOptions[]) {
    const data = await CollectorService.collectData(integrationOptions);

    return Promise.all(
      data.map(async ({ dataSource, data }) => {
        try {
          const retrievedMetrics: DataboxMetric[] = data
            .filter((d) => d.value !== undefined && !d.error)
            .map((d) => ({
              name: d.name,
              value: d.value!,
              date: d.date,
            }));

          await DataboxIntegrationService.pushMetrics(retrievedMetrics);

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

export default new IntegrationService();
