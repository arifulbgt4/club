import type { Intent, Issue } from "@prisma/client";

export interface CollaborateOpenProps {
  id: string;
}

export interface ItemProps {
  issue: Issue;
  intent: Intent;
}
