import RedditIntegrationService from "../../integrations/reddit/RedditIntegrationService";
import { Subreddit } from "../../integrations/reddit/RedditModels";
import { MetricData, MetricRetriever } from "../CollectorModels";
import { MetricReddit } from "./Configurations";

class SubredditPostsCountRetriever implements MetricRetriever {
  async getData(metric: MetricReddit): Promise<MetricData> {
    const subredditName = this.mapMetricToSubreddit(metric);

    const todaysPostCount = await this.getSinglePostPage(subredditName);

    return {
      name: metric,
      value: todaysPostCount,
    };
  }

  async getSinglePostPage(
    subredditName: Subreddit,
    nextPage?: string,
    count = 0
  ): Promise<number> {
    const {
      data: { children, after },
    } = await RedditIntegrationService.getSubredditPosts(
      subredditName,
      nextPage
    );

    if (!children.length) {
      return 0;
    }

    const lastPostDate = children.at(-1)!.data.created_utc * 1000;
    const startOfDay = new Date().setUTCHours(0, 0, 0, 0);

    if (lastPostDate < startOfDay) {
      const todaysLastPostIndex = children.findIndex(
        (post) => post.data.created_utc * 1000 < startOfDay
      );

      return count + todaysLastPostIndex;
    }

    return this.getSinglePostPage(
      subredditName,
      after,
      count + children.length
    );
  }

  mapMetricToSubreddit(metric: MetricReddit) {
    switch (metric) {
      case MetricReddit.TypeScriptPostCount:
        return Subreddit.typescript;
      case MetricReddit.GoPostCount:
        return Subreddit.golang;
      case MetricReddit.PhpPostCount:
        return Subreddit.php;
      case MetricReddit.PythonPostCount:
        return Subreddit.python;
      default:
        throw new Error("Metric not supported by SubredditPostsCountRetriever");
    }
  }
}

export default new SubredditPostsCountRetriever();
