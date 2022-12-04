import { RetrieverPerMetric } from "../CollectorModels";
import SubredditPostsCountRetriever from "./SubredditPostsCountRetriever";

export enum MetricReddit {
  TypeScriptPostCount = "TypeScriptPostCount",
  GoPostCount = "GoPostCount",
  PhpPostCount = "PhpPostCount",
  PythonPostCount = "PythonPostCount",
}

export const redditMetricRetrievers: RetrieverPerMetric = {
  [MetricReddit.TypeScriptPostCount]: SubredditPostsCountRetriever,
  [MetricReddit.GoPostCount]: SubredditPostsCountRetriever,
  [MetricReddit.PhpPostCount]: SubredditPostsCountRetriever,
  [MetricReddit.PythonPostCount]: SubredditPostsCountRetriever,
};
