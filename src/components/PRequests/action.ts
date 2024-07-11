import { IssueState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

const TAKE = 10;

export async function getList(page: number = 1) {
  const { user } = await validateRequest();
  const requests = await db.request.findMany({
    where: {
      userId: user?.id,
      issue: {
        active: true,
        state: IssueState.published,
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
  return { requests, take: TAKE, page };
}
