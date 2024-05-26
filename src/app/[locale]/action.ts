import db from "~/lib/db";
import { type IssueOptions } from "~/types";

export async function getIssues() {
  const issues = await db.issue.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      repo: true,
    },
  });
  return issues as IssueOptions[];
}
