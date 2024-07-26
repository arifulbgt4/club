import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export default async function getCollaborate() {
  const { user } = await validateRequest();

  const collaborate = await db.collaborate.findMany({
    where: {
      userId: user?.id,
      accept: true,
      active: true,
      repository: {
        active: true,
      },
    },
    include: {
      repository: {
        include: {
          provider: {
            select: {
              name: true,
              picture: true,
            },
          },
        },
      },
    },
  });

  return collaborate;
}
