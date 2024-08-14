import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { user, session } = await validateRequest();
    if (!session || Number(body?.days) <= 0) {
      return new Response("Unauthorized", { status: 401 });
    }

    const request = await db.request.create({
      data: {
        days: Number(body?.days),
        issue: {
          connect: {
            id: body?.issueId,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    return NextResponse.json(request);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
