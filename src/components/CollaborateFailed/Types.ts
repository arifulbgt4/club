import type { Intent, Issue } from "@prisma/client";

export interface CollaborateFailedProps {
  id: string;
}

export interface ItemProps {
  issue: Issue;
  intent: Intent;
}
