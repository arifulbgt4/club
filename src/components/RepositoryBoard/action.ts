import { IssueState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getCounts(repoId: string) {
  const { user } = await validateRequest();

  // Use a single query with aggregation
  const counts = await db.issue.groupBy({
    by: ["state"],
    _count: {
      state: true,
    },
    where: { userId: user?.id, repositoryId: repoId },
  });

  // Initialize counts object with all states set to 0
  const result = {
    reassigned: 0,
    done: 0,
    inreview: 0,
    draft: 0,
    published: 0,
    inprogress: 0,
  };

  // Map the counts to the corresponding state
  counts.forEach(({ state, _count }) => {
    switch (state) {
      case IssueState.reassign:
        result.reassigned = _count.state;
        break;
      case IssueState.done:
        result.done = _count.state;
        break;
      case IssueState.inprogress:
        result.inprogress = _count.state;
        break;
      case IssueState.inreview:
        result.inreview = _count.state;
        break;
      case IssueState.published:
        result.published = _count.state;
        break;
      case IssueState.draft:
        result.draft = _count.state;
        break;
    }
  });

  return result;
}

export async function getPublished(repoId: string) {
  const { user } = await validateRequest();
  const issues = await db.issue.findMany({
    where: {
      repositoryId: repoId,
      state: IssueState.published,
      active: true,
      userId: user?.id,
    },
    include: {
      request: {
        take: 9,
        skip: 0,
      },
    },
  });
  if (!issues) {
    return null;
  }
  return issues;
}
