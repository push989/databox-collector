import {
  dataSourceRetrievers,
  DataSource,
  MetricData,
  MetricName,
  MetricRetriever,
} from "./CollectorModels";
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
        const metricsToRetrieve = metrics?.length
          ? metrics
          : this.getAllDataSourceMetrics(dataSource);

        const data = await Promise.all(
          metricsToRetrieve.map((metric) => this.retrieveMetricData(dataSource, metric))
        );

        return {
          dataSource,
          data,
        };
      })
    );
  }

  private async retrieveMetricData(
    dataSource: DataSource,
    metric: MetricName
  ): Promise<MetricData> {
    const retriever = this.getMetricRetriever(dataSource, metric);
    try {
      return await retriever.getData(metric);
    } catch (error) {
      return {
        name: metric,
        error: error as Error,
      };
    }
  }

  getMetricRetriever(dataSource: DataSource, metric: MetricName): MetricRetriever {
    const retriever = dataSourceRetrievers[dataSource][metric];

    if (!retriever) {
      throw new Error("Retriever not defined for metric!");
    }

    return retriever;
  }

  private getAllDataSourceMetrics(dataSource: DataSource): MetricName[] {
    return Object.keys(dataSourceRetrievers[dataSource]) as MetricName[];
  }
}

export default new CollectorService();
