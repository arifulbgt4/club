import type { Intent, Issue } from "@prisma/client";

export interface CollaborateDoneProps {
  id: string;
}

export interface ItemProps {
  issue: Issue;
  intent: Intent;
}
