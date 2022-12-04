import { RetrieverPerMetric } from "../CollectorModels";
import QuestionCountRetriever from "./QuestionCountRetriever";

export enum MetricStackOverflow {
  TypeScriptQuestionCount = "TypeScriptQuestionCount",
  PythonQuestionCount = "PythonQuestionCount",
  GoQuestionCount = "GoQuestionCount",
  PhpQuestionCount = "PhpQuestionCount",
}

export const stackOverflowMetricRetrievers: RetrieverPerMetric = {
  [MetricStackOverflow.TypeScriptQuestionCount]: QuestionCountRetriever,
  [MetricStackOverflow.PythonQuestionCount]: QuestionCountRetriever,
  [MetricStackOverflow.GoQuestionCount]: QuestionCountRetriever,
  [MetricStackOverflow.PhpQuestionCount]: QuestionCountRetriever,
};
