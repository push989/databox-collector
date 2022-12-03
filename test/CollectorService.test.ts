import StackOverflowIntegrationService from "../src/integrations/stackoverflow/StackOverflowIntegrationService";
import { QuestionCount } from "../src/integrations/stackoverflow/StackOverflowModels";
import { DataSource } from "../src/services/CollectorModels";
import CollectorService from "../src/services/CollectorService";
import { MetricStackOverflow } from "../src/services/stackoverflow/Configuration";

describe("CollectorService", () => {
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

  test("Get value for a single question count metric", async () => {
    const response = await CollectorService.execute([
      {
        dataSource: DataSource.StackOverflow,
        metrics: [MetricStackOverflow.TypescriptQuestionCount],
      },
    ]);

    expect(response).toEqual([
      {
        dataSource: DataSource.StackOverflow,
        data: [
          expect.objectContaining({
            name: MetricStackOverflow.TypescriptQuestionCount,
            value: mockTypescriptResponse.questionCount,
          }),
        ],
      },
    ]);
  });

  test("Get values for multiple question count metrics", async () => {
    const result = await CollectorService.execute([
      {
        dataSource: DataSource.StackOverflow,
        metrics: [
          MetricStackOverflow.TypescriptQuestionCount,
          MetricStackOverflow.GoQuestionCount,
        ],
      },
    ]);

    expect(result).toEqual([
      {
        dataSource: DataSource.StackOverflow,
        data: expect.arrayContaining([
          expect.objectContaining({
            name: MetricStackOverflow.TypescriptQuestionCount,
            value: mockTypescriptResponse.questionCount,
          }),
          expect.objectContaining({
            name: MetricStackOverflow.GoQuestionCount,
            value: mockGoResponse.questionCount,
          }),
        ]),
      },
    ]);
  });

  test("Get values for all question count metrics", async () => {
    const result = await CollectorService.execute([
      {
        dataSource: DataSource.StackOverflow,
      },
    ]);

    expect(result).toEqual([
      {
        dataSource: DataSource.StackOverflow,
        data: expect.arrayContaining([
          expect.objectContaining({
            name: MetricStackOverflow.TypescriptQuestionCount,
            value: mockTypescriptResponse.questionCount,
          }),
          expect.objectContaining({
            name: MetricStackOverflow.GoQuestionCount,
            value: mockGoResponse.questionCount,
          }),
          expect.objectContaining({
            name: MetricStackOverflow.PhpQuestionCount,
            value: mockPhpResponse.questionCount,
          }),
          expect.objectContaining({
            name: MetricStackOverflow.PythonQuestionCount,
            value: mockPythonResponse.questionCount,
          }),
        ]),
      },
    ]);
  });
});
