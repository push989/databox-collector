import Logger from "../common/Logger";
import DataboxIntegrationService from "../integrations/databox/DataboxIntegrationService";
import CollectorService from "./collector/CollectorService";
import { IntegrationOptions, IntegrationResponse } from "./IntegrationModels";

class IntegrationService {
  async integrate(integrationOptions: IntegrationOptions[]): Promise<IntegrationResponse[]> {
    const data = await CollectorService.collectData(integrationOptions);

    return Promise.all(
      data.map(async ({ dataSource, data }) => {
        try {
          const retrievedMetrics = data.filter((d) => d.value !== undefined && !d.error);

          if (retrievedMetrics.length) {
            await DataboxIntegrationService.pushMetrics(
              retrievedMetrics.map((d) => ({
                name: d.name,
                value: d.value!,
                date: d.date,
              }))
            );

            Logger.log("databox_send", {
              serviceName: dataSource,
              metrics: retrievedMetrics,
              numberOfKpis: data.length,
              success: true,
            });
          }

          return {
            dataSource,
            metricsSent: retrievedMetrics,
            metricsFailed: data
              .filter((metric) => metric.error)
              .map((metric) => ({ metric: metric.name, error: metric.error!.message! })),
          };
        } catch (error) {
          const errorMessage = (error as Error)?.message;

          Logger.error("databox_send", {
            serviceName: dataSource,
            metrics: data,
            numberOfKpis: data.length,
            success: false,
            error: errorMessage ?? error,
          });

          return {
            dataSource,
            error: errorMessage,
          };
        }
      })
    );
  }
}

export default new IntegrationService();
