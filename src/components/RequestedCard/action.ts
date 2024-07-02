import { RequestState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getApplyed() {
  const { user } = await validateRequest();
  const request = await db.request.findMany({
    where: { userId: user?.id, state: RequestState.open },
    take: 6,
    skip: 0,
    include: {
      issue: true,
    },
  });
  const total = await db.request.count({
    where: { userId: user?.id, state: RequestState.open },
  });
  return { request, total };
}
