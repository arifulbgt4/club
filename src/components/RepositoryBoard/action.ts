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

const TAKE = 10;

export async function getPublished(repoId: string, page: number = 1) {
  const { user } = await validateRequest();
  const intents = await db.intent.findMany({
    where: {
      active: true,
      issue: {
        repositoryId: repoId,
        state: IssueState.published,
        active: true,
        userId: user?.id,
      },
    },
    take: TAKE,
    orderBy: {
      updatedAt: "desc",
    },
    skip: (page - 1) * TAKE,
    include: {
      issue: {
        include: {
          request: {
            take: 8,
            skip: 0,
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  picture: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!intents) {
    return null;
  }
  return { intents, take: TAKE, page };
}
export async function getInProgress(repoId: string, page: number = 1) {
  const { user } = await validateRequest();
  const intents = await db.intent.findMany({
    where: {
      active: true,
      issue: {
        repositoryId: repoId,
        state: {
          in: [IssueState.inprogress, IssueState.reassign],
        },
        active: true,
        userId: user?.id,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
    include: {
      issue: true,
      request: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              picture: true,
            },
          },
        },
      },
    },
  });
  if (!intents) {
    return null;
  }
  return { intents, take: TAKE, page };
}

export async function getInReview(repoId: string, page: number = 1) {
  const { user } = await validateRequest();
  const intents = await db.intent.findMany({
    where: {
      active: true,
      issue: {
        repositoryId: repoId,
        state: IssueState.inreview,
        active: true,
        userId: user?.id,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
    include: {
      issue: {
        include: {
          repository: true,
        },
      },
      request: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              picture: true,
            },
          },
        },
      },
    },
  });
  if (!intents) {
    return null;
  }
  return { intents, take: TAKE, page };
}

export async function getDone(repoId: string, page: number = 1) {
  const { user } = await validateRequest();
  const intents = await db.intent.findMany({
    where: {
      success: true,
      active: false,
      issue: {
        repositoryId: repoId,
        userId: user?.id,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
    include: {
      issue: true,
      request: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              picture: true,
            },
          },
        },
      },
    },
  });
  if (!intents) {
    return null;
  }
  return { intents, take: TAKE, page };
}

export async function getDraft(repoId: string, page: number = 1) {
  const { user } = await validateRequest();
  const intents = await db.intent.findMany({
    where: {
      active: true,
      issue: {
        repositoryId: repoId,
        state: IssueState.draft,
        userId: user?.id,
        active: true,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      issue: true,
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
  });
  if (!intents) {
    return null;
  }
  return { intents, take: TAKE, page };
}
