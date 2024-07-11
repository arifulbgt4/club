import { IssueState, IssueStatus } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const { user, session } = await validateRequest();
    if (!session || !body?.issueId || !body?.intentId || !body?.requestId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const intent = await db.intent.findUnique({
      where: {
        id: body?.intentId,
        active: true,
        pr_number: Number(body?.prNumber),
        issue: {
          id: body?.issueId,
          state: IssueState.reassign,
          status: IssueStatus.default,
        },
        request: {
          id: body?.requestId,
        },
      },
    });

    await db.intent.update({
      where: {
        id: body?.id,
        issueId: intent?.issueId,
        requestId: intent?.requestId as string,
      },
      data: {
        issue: {
          update: {
            state: IssueState.inreview,
            status: IssueStatus.default,
            user: {
              update: {
                available: true,
              },
            },
          },
        },
      },
    });

    const isQueue = await db.intent.findMany({
      where: {
        issue: {
          state: {
            in: [IssueState.inprogress, IssueState.reassign],
          },
          status: IssueStatus.queue,
        },
        request: {
          userId: user?.id,
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    if (!!isQueue?.length) {
      const queueIntent = isQueue[0];
      await db.intent.update({
        where: {
          id: queueIntent.id,
          issue: {
            status: IssueStatus.queue,
          },
        },
        data: {
          issue: {
            update: {
              state: IssueState.inprogress,
              status: IssueStatus.default,
              user: {
                update: {
                  available: false,
                },
              },
            },
          },
        },
      });
    }

    return new Response("Successfully re-submit", { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
