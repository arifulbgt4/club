import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

const TAKE = 10;

export async function getList(page: number = 1) {
  const { user } = await validateRequest();

  const intents = await db.intent.findMany({
    where: {
      active: false,
      success: true,
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
  return { intents, take: TAKE, page };
}
