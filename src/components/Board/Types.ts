interface User {
  id: string;
  picture: string;
  username: string;
}
interface Request {
  id: string;
  days: number;
  user: User;
}

export interface RequestsProps extends Request {
  issueId: string;
}

export interface BoardProps {
  src: string;
  repoId: string;
}
export interface PublishedProps {
  id: string;
  title?: string;
  request: Request[];
}
export interface AssignedProps {
  id: string;
  title?: string;
  src: string;
}
export interface SubmittedProps {
  src: string;
}
export interface CompletedProps {
  src: string;
}
