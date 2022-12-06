import RedditIntegrationService from "../src/integrations/reddit/RedditIntegrationService";
import { MetricReddit } from "../src/services/reddit/Configurations";
import SubredditPostsCountRetriever from "../src/services/reddit/SubredditPostsCountRetriever";

describe("SubbredditPostCountRetriever", () => {
  const dayBefore = new Date("2022-12-04T00:00:00.000Z");
  const today = new Date("2022-12-05T12:00:00.000Z");
  jest.useFakeTimers().setSystemTime(today);

  const todayPostsPage = {
    kind: "Listing",
    data: {
      after: "asfd",
      dist: 12,
      modhash: "",
      geo_filter: "",
      children: [
        {
          kind: "item",
          data: {
            created_utc: today.getTime() / 1000,
          },
        },
        {
          kind: "item",
          data: {
            created_utc: today.getTime() / 1000,
          },
        },
      ],
    },
  };

  const lastTodaysPostPage = {
    kind: "Listing",
    data: {
      after: "asfd",
      dist: 12,
      modhash: "",
      geo_filter: "",
      children: [
        {
          kind: "item",
          data: {
            created_utc: today.getTime() / 1000,
          },
        },
        {
          kind: "item",
          data: {
            created_utc: dayBefore.getTime() / 1000,
          },
        },
      ],
    },
  };

  test("Return a count of today's posts by getting new post pages until you find the first post of the day", async () => {
    const getSubredditPostsSpy = jest
      .spyOn(RedditIntegrationService, "getSubredditPosts")
      .mockResolvedValueOnce(todayPostsPage)
      .mockResolvedValueOnce(todayPostsPage)
      .mockResolvedValueOnce(lastTodaysPostPage);

    const result = await SubredditPostsCountRetriever.getData(MetricReddit.GoPostCount);

    expect(getSubredditPostsSpy).toBeCalledTimes(3);
    expect(result).toEqual({
      name: MetricReddit.GoPostCount,
      value: 5,
    });
  });

  test.each([
    MetricReddit.GoPostCount,
    MetricReddit.PhpPostCount,
    MetricReddit.PythonPostCount,
    MetricReddit.TypeScriptPostCount,
  ])("Metric supported - %o", async (metric) => {
    jest
      .spyOn(RedditIntegrationService, "getSubredditPosts")
      .mockResolvedValueOnce(lastTodaysPostPage);

    const result = await SubredditPostsCountRetriever.getData(metric);

    expect(result).toEqual({
      name: metric,
      value: 1,
    });
  });
});
