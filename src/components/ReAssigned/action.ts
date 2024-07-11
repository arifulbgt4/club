import { IssueState, IssueStatus } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

const TAKE = 10;

export async function getList(page: number = 1) {
  const { user } = await validateRequest();

  const intents = await db.intent.findMany({
    where: {
      active: true,
      issue: {
        state: {
          in: [IssueState.reassign, IssueState.inprogress],
        },
        status: IssueStatus.queue,
      },
      request: {
        userId: user?.id,
      },
    },
    include: {
      issue: true,
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
  });
  return { intents, take: TAKE, page };
}
