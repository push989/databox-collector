import { DataSource } from "../src/services/collector/CollectorModels";
import CollectorService from "../src/services/collector/CollectorService";
import { MetricReddit } from "../src/services/reddit/Configurations";
import { MetricStackOverflow } from "../src/services/stackoverflow/Configuration";

describe("CollectorService", () => {
  jest.spyOn(CollectorService, "getMetricRetriever").mockImplementation((dataSource, metric) => ({
    getData: async () => ({
      name: metric,
      value: 100,
    }),
  }));

  test("Get value for a single metric", async () => {
    const response = await CollectorService.collectData([
      {
        dataSource: DataSource.StackOverflow,
        metrics: [MetricStackOverflow.TypeScriptQuestionCount],
      },
    ]);

    expect(response).toEqual([
      {
        dataSource: DataSource.StackOverflow,
        data: [
          expect.objectContaining({
            name: MetricStackOverflow.TypeScriptQuestionCount,
            value: 100,
          }),
        ],
      },
    ]);
  });

  test("Get values for multiple metrics", async () => {
    const result = await CollectorService.collectData([
      {
        dataSource: DataSource.StackOverflow,
        metrics: [MetricStackOverflow.TypeScriptQuestionCount, MetricStackOverflow.GoQuestionCount],
      },
    ]);

    expect(result).toEqual([
      {
        dataSource: DataSource.StackOverflow,
        data: expect.arrayContaining([
          expect.objectContaining({
            name: MetricStackOverflow.TypeScriptQuestionCount,
            value: 100,
          }),
          expect.objectContaining({
            name: MetricStackOverflow.GoQuestionCount,
            value: 100,
          }),
        ]),
      },
    ]);
  });

  test("Get values for all datasource metrics", async () => {
    const result = await CollectorService.collectData([
      {
        dataSource: DataSource.StackOverflow,
      },
    ]);

    expect(result).toEqual([
      {
        dataSource: DataSource.StackOverflow,
        data: expect.arrayContaining([
          expect.objectContaining({
            name: MetricStackOverflow.TypeScriptQuestionCount,
            value: 100,
          }),
          expect.objectContaining({
            name: MetricStackOverflow.GoQuestionCount,
            value: 100,
          }),
          expect.objectContaining({
            name: MetricStackOverflow.PhpQuestionCount,
            value: 100,
          }),
          expect.objectContaining({
            name: MetricStackOverflow.PythonQuestionCount,
            value: 100,
          }),
        ]),
      },
    ]);
  });

  test("Get values for multiple datasource metrics", async () => {
    const result = await CollectorService.collectData([
      { dataSource: DataSource.StackOverflow, metrics: [MetricStackOverflow.GoQuestionCount] },
      { dataSource: DataSource.Reddit, metrics: [MetricReddit.GoPostCount] },
    ]);

    expect(result).toEqual([
      {
        dataSource: DataSource.StackOverflow,
        data: expect.arrayContaining([
          expect.objectContaining({
            name: MetricStackOverflow.GoQuestionCount,
            value: 100,
          }),
        ]),
      },
      {
        dataSource: DataSource.Reddit,
        data: expect.arrayContaining([
          expect.objectContaining({
            name: MetricReddit.GoPostCount,
            value: 100,
          }),
        ]),
      },
    ]);
  });
});
