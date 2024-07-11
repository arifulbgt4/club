import { type IntentType } from "@prisma/client";

export interface ApplyProps {
  issueId: string;
  price: number;
  issueType: IntentType;
  disabled: boolean;
}
