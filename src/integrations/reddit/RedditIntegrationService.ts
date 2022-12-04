import axios from "axios";
import FormData from "form-data";
import { appConfig } from "../../appConfig";
import {
  RedditAuthResponse,
  Subreddit,
  SubredditPostsResponse,
} from "./RedditModels";

class RedditIntegrationService {
  private accessToken: Promise<string> | null = null;

  async getAccessToken(): Promise<string> {
    if (!this.accessToken) {
      this.accessToken = this.authorize();
    }

    try {
      return await this.accessToken;
    } catch (error) {
      this.accessToken = null;
      throw error;
    }
  }

  async authorize(): Promise<string> {
    const form = new FormData();
    form.append("grant_type", "client_credentials");
    form.append("device_id", "DO_NOT_TRACK_THIS_DEVICE");

    const authResult = await axios.post<RedditAuthResponse>(
      appConfig.redditAuthUrl,
      form,
      {
        headers: form.getHeaders(),
        auth: {
          username: appConfig.redditClientId,
          password: appConfig.redditClientSecret,
        },
      }
    );

    setTimeout(() => {
      this.accessToken = null;
    }, authResult.data.expires_in - 10 * 1000);

    return authResult.data.access_token;
  }

  async getSubredditPosts(subreddit: Subreddit, after?: string, limit = 100) {
    const access_token = await this.getAccessToken();

    const subredditPostsResponse = await axios.get<SubredditPostsResponse>(
      `${appConfig.redditBaseUrl}/r/${subreddit}/new`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
        params: { limit, after },
      }
    );

    return subredditPostsResponse.data;
  }
}

export default new RedditIntegrationService();
