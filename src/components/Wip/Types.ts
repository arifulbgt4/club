export interface WipProps {}

export interface SubmitProps {
  requestId: string;
  issueId: string;
  intentId: string;
  isReSubmit: boolean;
  previous_pr?: number;
}
