import { DataSource, MetricData, MetricName } from "./collector/CollectorModels";
import { MetricReddit } from "./reddit/Configurations";
import { MetricStackOverflow } from "./stackoverflow/Configuration";

export interface RedditMetrics {
  dataSource: DataSource.Reddit;
  metrics?: MetricReddit[];
}

export interface StackOverflowMetrics {
  dataSource: DataSource.StackOverflow;
  metrics?: MetricStackOverflow[];
}

export type IntegrationOptions = RedditMetrics | StackOverflowMetrics;

export interface IntegrationResponse {
  dataSource: DataSource;
  metricsSent?: MetricData[];
  metricsFailed?: {
    metric: MetricName;
    error: string;
  }[];
  error?: string;
}
