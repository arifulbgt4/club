import { RequestState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getList() {
  const { user } = await validateRequest();
  const count = await db.request.count({
    where: { userId: user?.id, state: RequestState.open },
  });
  const requests = await db.request.findMany({
    where: { userId: user?.id, state: RequestState.open },
    include: {
      issue: {
        include: {
          user: {
            select: {
              name: true,
              username: true,
              picture: true,
            },
          },
        },
      },
    },
    take: 10,
    skip: 0,
  });
  return { requests, count };
}
