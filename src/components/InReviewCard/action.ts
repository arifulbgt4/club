import { RequestState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getInreview() {
  const { user } = await validateRequest();
  const list = await db.request.findMany({
    where: { userId: user?.id, state: RequestState.inreview },
    take: 6,
    skip: 0,
    include: {
      issue: true,
    },
  });
  const total = await db.request.count({
    where: { userId: user?.id, state: RequestState.inreview },
  });
  return { list, total };
}
