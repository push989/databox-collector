export interface QuestionApiResponse {
  has_more: boolean;
  quota_max: number;
  quota_remaining: number;
  total: number;
}

export interface QuestionCount {
  tag: StackOverflowTag;
  questionCount: number;
}

export type StackOverflowTag = "typescript" | "python" | "go" | "php";
