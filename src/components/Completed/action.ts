import { RequestState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

const TAKE = 10;

export async function getList(page: number = 1) {
  const { user } = await validateRequest();
  const total = await db.request.count({
    where: { userId: user?.id, state: RequestState.completed },
  });
  const requests = await db.request.findMany({
    where: { userId: user?.id, state: RequestState.completed },
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
    take: TAKE,
    skip: (page - 1) * TAKE,
  });
  return { requests, total, take: TAKE, page };
}
