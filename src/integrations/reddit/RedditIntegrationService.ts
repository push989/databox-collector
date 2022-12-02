import axios from "axios";
import FormData from "form-data";
import { appConfig } from "../../appConfig";
import { RedditAuthResponse } from "./RedditModels";

class RedditIntegrationService {
  private readonly BASE_URL = "https://www.reddit.com/api/v1";
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
      `${this.BASE_URL}/access_token`,
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
}

export default new RedditIntegrationService();
