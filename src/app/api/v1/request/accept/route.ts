import { IssueState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const { session } = await validateRequest();
    if (!session || !body?.issueId || !body?.intentId || !body?.requestId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await db.intent.update({
      where: {
        id: body?.intentId,
      },
      data: {
        request: {
          connect: {
            id: body?.requestId,
          },
        },
        issue: {
          update: {
            state: IssueState.inprogress,
          },
        },
      },
    });

    if (!update) {
      return new Response("Wrong information", { status: 401 });
    }

    await db.request.update({
      where: { id: body.requestId },
      data: { approved: true, user: { update: { available: false } } },
    });

    await db.request.deleteMany({
      where: {
        id: {
          not: body?.requestId,
        },
        issueId: body?.issueId,
      },
    });

    return new Response("success", { status: 200 });
  } catch (error) {
    console.log("error: ", error);
    return new Response(null, { status: 500 });
  }
}
