import db from "~/lib/db";

export async function getIssues() {
  const issues = await db.issue.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return issues;
}
