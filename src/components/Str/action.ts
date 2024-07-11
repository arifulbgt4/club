import { IssueState, RequestState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

const TAKE = 10;

export async function getList(page: number = 1) {
  const { user } = await validateRequest();
  const total = await db.request.count({
    where: { userId: user?.id, state: RequestState.inreview },
  });
  const intents = await db.intent.findMany({
    where: {
      active: true,
      issue: {
        state: IssueState.inreview,
      },
      request: {
        userId: user?.id,
      },
    },
    include: {
      issue: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
  });
  return { intents, total, take: TAKE, page };
}
