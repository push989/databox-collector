import {
  MetricStackOverflow,
  stackOverflowMetricRetrievers,
} from "./stackoverflow/Configuration";

export enum MetricReddit {
  Views = "Views",
}

export enum DataSource {
  Reddit = "Reddit",
  StackOverflow = "StackOverflow",
}

export interface MetricData {
  name: string;
  value: number;
  date?: Date;
}

export type MetricName = MetricStackOverflow | MetricReddit;

export interface MetricRetriever {
  getData(metric: MetricName): Promise<MetricData>;
}

export type DataSourceMetricRetrievers = Partial<
  Record<MetricName, MetricRetriever>
>;

export const dataSourceConfiguration: Record<
  DataSource,
  DataSourceMetricRetrievers
> = {
  [DataSource.StackOverflow]: stackOverflowMetricRetrievers,
  // TODO: add reddit retrievers
  [DataSource.Reddit]: {} as unknown as DataSourceMetricRetrievers,
};
