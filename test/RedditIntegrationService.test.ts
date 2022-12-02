import axios from "axios";
import RedditIntegrationService from "../src/integrations/reddit/RedditIntegrationService";
jest.mock("axios");

describe("RedditIntegrationService", () => {
  const axiosMock = jest.mocked(axios);

  jest.useFakeTimers();
  const authorizeSpy = jest.spyOn(RedditIntegrationService, "authorize");

  const authResponse = {
    data: {
      access_token: "test-token",
      expires_in: 1000,
      scope: "*",
      token_type: "Bearer",
    },
  };

  beforeEach(() => {
    authorizeSpy.mockClear();
    axiosMock.post.mockResolvedValue(authResponse);
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  test("Sucessfully return the access token", async () => {
    const access_token = await RedditIntegrationService.getAccessToken();
    expect(access_token).toEqual(authResponse.data.access_token);
  });

  test("Don't repeat the authorize api call", async () => {
    const [access_token1, access_token2] = await Promise.all([
      RedditIntegrationService.getAccessToken(),
      RedditIntegrationService.getAccessToken(),
    ]);

    expect(access_token1).toBe(authResponse.data.access_token);
    expect(access_token2).toBe(authResponse.data.access_token);
    expect(authorizeSpy).toHaveBeenCalledTimes(1);
  });

  test("Get a fresh token after expiration", async () => {
    const firstToken = await RedditIntegrationService.getAccessToken();

    const newTokenResponse = {
      data: { ...authResponse.data, access_token: "test-token2" },
    };
    axiosMock.post.mockResolvedValue(newTokenResponse);

    jest.runAllTimers();
    const secondToken = await RedditIntegrationService.getAccessToken();

    expect(firstToken).toBe(authResponse.data.access_token);
    expect(secondToken).toBe(newTokenResponse.data.access_token);
    expect(authorizeSpy).toHaveBeenCalledTimes(2);
  });

  test("Don't cache if an error is thrown on authorization", async () => {
    const httpError = new Error("http error");
    axiosMock.post.mockRejectedValueOnce(httpError);
    let receivedError: Error | undefined;

    try {
      await RedditIntegrationService.getAccessToken();
    } catch (error) {
      receivedError = error as Error;
    }
    const token = await RedditIntegrationService.getAccessToken();

    expect(receivedError).toBe(httpError);
    expect(token).toBe(authResponse.data.access_token);
    expect(authorizeSpy).toHaveBeenCalledTimes(2);
  });
});
