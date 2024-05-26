import db from "~/lib/db";
import { type IssueOptions } from "~/types";

const TAKE = 10;

export async function getIssues(page: number = 1) {
  const issues = await db.issue.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
    include: {
      user: true,
      repo: true,
    },
  });
  const total = await db.issue.count();
  return { issues: issues as IssueOptions[], total, take: TAKE, page };
}
