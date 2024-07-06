import { IssueState } from "@prisma/client";
import db from "~/lib/db";
import { type IssueOptions } from "~/types";

const TAKE = 10;

export async function getIssues(page: number = 1, topics?: string[]) {
  const issues = await db.issue.findMany({
    where: {
      state: IssueState.published,
      repository: {
        active: true,
        provider: {
          active: true,
        },
      },
      published: true,
      ...(!!topics?.length && {
        topics: {
          hasSome: topics,
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
    include: {
      user: true,
      repository: {
        include: {
          provider: true,
        },
      },
    },
  });
  const total = await db.issue.count({
    where: {
      state: IssueState.published,
      published: true,
    },
  });
  return { issues: issues as IssueOptions[], total, take: TAKE, page };
}
