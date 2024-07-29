import { IssueState } from "@prisma/client";
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
              state: { in: [IssueState.inprogress, IssueState.reassign] },
              request: {
                some: {
                  userId: user?.id,
                },
              },
              intent: {
                some: {
                  active: true,
                  success: true,
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
