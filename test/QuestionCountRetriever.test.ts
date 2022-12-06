import StackOverflowIntegrationService from "../src/integrations/stackoverflow/StackOverflowIntegrationService";
import { QuestionCount } from "../src/integrations/stackoverflow/StackOverflowModels";
import { MetricStackOverflow } from "../src/services/stackoverflow/Configuration";
import QuestionCountRetriever from "../src/services/stackoverflow/QuestionCountRetriever";

describe("QuestionCountRetriever", () => {
  const now = new Date();
  const mockTypescriptResponse: QuestionCount = {
    tag: "typescript",
    questionCount: 500,
  };

  const mockGoResponse: QuestionCount = {
    tag: "go",
    questionCount: 400,
  };

  const mockPhpResponse: QuestionCount = {
    tag: "php",
    questionCount: 300,
  };

  const mockPythonResponse: QuestionCount = {
    tag: "python",
    questionCount: 600,
  };

  jest
    .spyOn(StackOverflowIntegrationService, "getQuestionCount")
    .mockImplementation(async (tag) => {
      switch (tag) {
        case "typescript":
          return mockTypescriptResponse;
        case "php":
          return mockPhpResponse;
        case "go":
          return mockGoResponse;
        case "python":
          return mockPythonResponse;
        default:
          throw new Error();
      }
    });

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(now);
  });

  test.each([
    [MetricStackOverflow.GoQuestionCount, mockGoResponse.questionCount],
    [MetricStackOverflow.PhpQuestionCount, mockPhpResponse.questionCount],
    [MetricStackOverflow.PythonQuestionCount, mockPythonResponse.questionCount],
    [MetricStackOverflow.TypeScriptQuestionCount, mockTypescriptResponse.questionCount],
  ])("Successfully gets a metric value %o", async (metric, resultValue) => {
    const result = await QuestionCountRetriever.getData(metric);

    expect(result).toEqual({
      name: metric,
      value: resultValue,
      date: now,
    });
  });

  test("Throws error if metric is not supported", async () => {
    let thrownError: Error;
    try {
      await QuestionCountRetriever.getData("does not exist" as MetricStackOverflow);
    } catch (error) {
      thrownError = error as Error;
    }

    expect(thrownError!.message).toBe("Metric not supported by QuestionCountMetric");
  });
});
