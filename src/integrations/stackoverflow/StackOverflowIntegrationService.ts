import axios from "axios";
import Logger from "../../common/Logger";
import { QuestionApiResponse, QuestionCount, StackOverflowTag } from "./StackOverflowModels";

class StackOverflowIntegrationService {
  private readonly BASE_URL = "https://api.stackexchange.com/2.3";

  public async getQuestionCount(tag: StackOverflowTag): Promise<QuestionCount> {
    try {
      // TODO: add key for a higher daily request quota
      const response = await axios.get<QuestionApiResponse>(`${this.BASE_URL}/questions`, {
        params: {
          tagged: tag,
          site: "stackoverflow",
          filter: "!-)HENETStxNx", // TODO: could just be filter=total
        },
      });

      Logger.debug("stackoverflow_question_response", { response });

      return {
        tag,
        questionCount: response.data.total,
      };
    } catch (error) {
      Logger.error("stackoverflow_question_error", { error });

      throw error;
    }
  }
}

export default new StackOverflowIntegrationService();
