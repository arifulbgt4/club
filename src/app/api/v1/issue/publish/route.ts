import { IssueState, IssueType } from "@prisma/client";
import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const price = Number(body?.price || 0) >= 3 ? Number(body?.price) : 0;
  try {
    const { user, session } = await validateRequest();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (body?.tags?.length > 10 || !body?.tags?.length) {
      return new Response("An issue can have a maximum of 9 tags", {
        status: 401,
      });
    }
    const issue = await db.issue.upsert({
      where: {
        id: String(body?.id),
        userId: user?.id,
      },
      create: {
        id: String(body?.id),
        title: body?.title,
        issueNumber: Number(body?.issueNumber),
        ...(body.type === IssueType.paid && { price: price }),
        state: IssueState.published,
        type: body.type as IssueType,
        tag: [...body?.tags],
        repo: {
          connect: {
            id: body?.repoId,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
      update: {
        published: true,
      },
    });
    return NextResponse.json({ ...issue, id: Number(issue.id) });
  } catch (error) {
    console.log(error);

    return new Response(null, {
      status: 500,
    });
  }
}
