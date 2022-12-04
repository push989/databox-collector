import StackOverflowIntegrationService from "../../integrations/stackoverflow/StackOverflowIntegrationService";
import { StackOverflowTag } from "../../integrations/stackoverflow/StackOverflowModels";
import { MetricStackOverflow } from "./Configuration";
import { MetricData, MetricRetriever } from "../CollectorModels";

class QuestionCountRetriever implements MetricRetriever {
  async getData(metric: MetricStackOverflow): Promise<MetricData> {
    const { questionCount } = await StackOverflowIntegrationService.getQuestionCount(
      this.mapMetricToTag(metric)
    );

    return {
      name: metric,
      value: questionCount,
      date: new Date(),
    };
  }

  mapMetricToTag(metric: MetricStackOverflow): StackOverflowTag {
    switch (metric) {
      case MetricStackOverflow.TypeScriptQuestionCount:
        return "typescript";
      case MetricStackOverflow.PythonQuestionCount:
        return "python";
      case MetricStackOverflow.GoQuestionCount:
        return "go";
      case MetricStackOverflow.PhpQuestionCount:
        return "php";
      default:
        throw new Error("Metric not supported by QuestionCountMetric");
    }
  }
}

export default new QuestionCountRetriever();
