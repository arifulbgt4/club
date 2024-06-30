interface IssueLabelOption {
  id: string;
  name?: string;
}
export interface GitIssueItemProps {
  id: string;
  title: string;
  body?: string;
  labels?: IssueLabelOption[];
  number: number;
  state: string;
  repoId: string;
  html_url: string;
  assignee?: {
    avatar_url: string;
    login: string;
  };
}

export interface PublishFormProps {
  issueId: string;
  issueNumber: number;
  repoId: string;
  title: string;
}
