import { IssueState, IssueStatus } from "@prisma/client";
import db from "~/lib/db";

const TAKE = 10;

export async function getIssues(page: number = 1, topics?: string[]) {
  const FILTER = {
    active: true,
    success: true,
    issue: {
      state: IssueState.published,
      status: IssueStatus.default,
      user: {
        active: true,
      },
      repository: {
        active: true,
        provider: {
          active: true,
        },
      },
      ...(!!topics?.length && {
        topics: {
          hasSome: topics,
        },
      }),
    },
  };

  const intents = await db.intent.findMany({
    where: FILTER,
    orderBy: {
      updatedAt: "desc",
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
    include: {
      issue: {
        include: {
          repository: {
            include: {
              provider: true,
            },
          },
        },
      },
    },
  });

  const total = await db.intent.count({
    where: FILTER,
  });
  return { intents, total, take: TAKE, page };
}
