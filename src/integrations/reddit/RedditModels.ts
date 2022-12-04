export interface RedditAuthResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export enum Subreddit {
  typescript = "typescript",
  golang = "golang",
  php = "php",
  python = "python",
}

export interface SubredditPostsResponse {
  kind: string;
  data: {
    after: string;
    dist: number;
    modhash: string;
    geo_filter: string;
    children: {
      kind: string;
      data: {
        created_utc: number;
      };
    }[];
  };
}
