import axios from "axios";
import FormData from "form-data";
import { appConfig } from "../../appConfig";

interface RedditAuthResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

class RedditIntegrationService {
  readonly BASE_URL = "https://www.reddit.com/api/v1/access_token";
  accessToken: Promise<string> | null = null;

  private async getAccessToken(): Promise<string> {
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
      this.BASE_URL,
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
    }, authResult.data.expires_in * 1000);

    return authResult.data.access_token;
  }
}

export default new RedditIntegrationService();
