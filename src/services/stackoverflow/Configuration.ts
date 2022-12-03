import { DataSourceMetricRetrievers } from "../CollectorModels";
import QuestionCountRetriever from "./QuestionCountRetriever";

export enum MetricStackOverflow {
  TypescriptQuestionCount = "TypeScriptQuestionCount",
  PythonQuestionCount = "PythonQuestionCount",
  GoQuestionCount = "GoQuestionCount",
  PhpQuestionCount = "PhpQuestionCount",
}

export const stackOverflowMetricRetrievers: DataSourceMetricRetrievers = {
  [MetricStackOverflow.TypescriptQuestionCount]: QuestionCountRetriever,
  [MetricStackOverflow.PythonQuestionCount]: QuestionCountRetriever,
  [MetricStackOverflow.GoQuestionCount]: QuestionCountRetriever,
  [MetricStackOverflow.PhpQuestionCount]: QuestionCountRetriever,
};
