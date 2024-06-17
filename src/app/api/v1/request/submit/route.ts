import { RequestState } from "@prisma/client";
import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const { user } = await validateRequest();
    const res = await db.request.update({
      where: {
        id: body?.id,
        userId: user?.id,
        issueId: body?.issueId,
      },
      data: {
        state: RequestState.inreview,
        issue: {
          update: {
            status: "inreview",
          },
        },
        user: {
          update: {
            available: true,
          },
        },
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
