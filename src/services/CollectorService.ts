import { configPerDataSource, DataSource, MetricName, MetricRetriever } from "./CollectorModels";
import { MetricReddit } from "./reddit/Configurations";
import { MetricStackOverflow } from "./stackoverflow/Configuration";

// TODO extract these interface somewhere more client side
export interface RedditMetrics {
  dataSource: DataSource.Reddit;
  metrics?: MetricReddit[];
}

export interface StackOverflowMetrics {
  dataSource: DataSource.StackOverflow;
  metrics?: MetricStackOverflow[];
}

export type SyncOptions = RedditMetrics | StackOverflowMetrics;

class CollectorService {
  public async collectData(options: SyncOptions[]) {
    return Promise.all(
      options.map(async ({ dataSource, metrics }) => {
        const data = await this.getDataFromDataSource(dataSource, metrics);

        return {
          dataSource,
          data,
        };
      })
    );
  }

  async getDataFromDataSource(dataSource: DataSource, metrics?: MetricName[]) {
    const dataSourceConfig = configPerDataSource[dataSource];

    const metricsToRetrieve = metrics?.length
      ? metrics
      : this.getAllDataSourceMetrics(dataSourceConfig);

    return Promise.all(
      metricsToRetrieve.map(async (metric) => {
        const retriever = dataSourceConfig[metric];
        if (!retriever) {
          throw new Error("Retriever not defined for metric!");
        }

        return retriever.getData(metric);
      })
    );
  }

  getAllDataSourceMetrics(
    dataSourceConfig: Partial<Record<MetricName, MetricRetriever>>
  ): MetricName[] {
    return Object.keys(dataSourceConfig) as MetricName[];
  }
}

export default new CollectorService();
