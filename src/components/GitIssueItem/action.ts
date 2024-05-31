import db from "~/lib/db";

export async function checkIssue(id: bigint) {
  const isPublished = await db.issue.findUnique({
    where: { id, published: true },
  });
  return !!isPublished;
}
