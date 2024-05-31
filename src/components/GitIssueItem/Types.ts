interface IssueLabelOption {
  id: string;
  name?: string;
}
export interface GitIssueItemProps {
  id: bigint;
  title: string;
  body?: string;
  labels?: IssueLabelOption[];
  number: number;
  state: string;
  repoId: string;
  assignee?: {
    avatar_url: string;
    login: string;
  };
}
