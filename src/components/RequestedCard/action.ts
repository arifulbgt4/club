import { IssueState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getApplyed() {
  const { user } = await validateRequest();
  const request = await db.request.findMany({
    where: { userId: user?.id, issue: { state: IssueState.published } },
    take: 6,
    skip: 0,
    include: {
      issue: true,
    },
  });
  const total = await db.request.count({
    where: { userId: user?.id, issue: { state: IssueState.published } },
  });
  return { request, total };
}
