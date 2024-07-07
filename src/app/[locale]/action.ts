import { IssueState } from "@prisma/client";
import db from "~/lib/db";
import { type IssueOptions } from "~/types";

const TAKE = 10;

export async function getIssues(page: number = 1, topics?: string[]) {
  const FILTER = {
    state: IssueState.published,
    user: {
      active: true,
    },
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
  };
  const issues = await db.issue.findMany({
    where: {
      ...FILTER,
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
      ...FILTER,
    },
  });
  return { issues: issues as IssueOptions[], total, take: TAKE, page };
}
