import { IssueState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getInreview() {
  const { user } = await validateRequest();
  const list = await db.intent.findMany({
    where: {
      active: true,
      issue: {
        state: IssueState.inreview,
      },
      request: {
        userId: user?.id,
      },
    },
    take: 6,
    skip: 0,
    include: {
      issue: true,
    },
  });
  const total = await db.intent.count({
    where: {
      active: true,
      issue: {
        state: IssueState.inreview,
      },
      request: {
        userId: user?.id,
      },
    },
  });
  return { list, total };
}
