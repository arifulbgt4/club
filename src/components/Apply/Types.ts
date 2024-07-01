import { type IssueType } from "@prisma/client";

export interface ApplyProps {
  issueId: string;
  price: number;
  issueType: IssueType;
}
