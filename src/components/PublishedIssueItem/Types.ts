import type { Intent } from "@prisma/client";
import { type IssueOptions } from "~/types";

export interface PublishedIssueItemProps extends Intent {
  issue?: IssueOptions;
}
