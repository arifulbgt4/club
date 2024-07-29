import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getIssues(id: string) {
  const { user } = await validateRequest();

  const collaborate = await db.collaborate.findUnique({
    where: { id, userId: user?.id, active: true },
    include: {
      repository: {
        include: {
          issue: {
            where: {
              active: true,
              request: {
                some: {
                  userId: user?.id,
                },
              },
              intent: {
                some: {
                  active: false,
                  success: false,
                },
              },
            },
            include: {
              intent: {
                include: {
                  request: true,
                },
              },
            },
          },
          provider: {
            select: {
              id: true,
              name: true,
              picture: true,
            },
          },
        },
      },
    },
  });

  if (!collaborate) {
    return null;
  }

  return collaborate.repository?.issue;
}
