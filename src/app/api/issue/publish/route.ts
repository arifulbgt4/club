import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { user } = await validateRequest();
    const issue = await db.issue.upsert({
      where: {
        id: BigInt(body?.id),
        userId: user?.id,
      },
      create: {
        id: BigInt(body?.id),
        issueNumber: Number(body?.issueNumber),
        state: body?.state,
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
