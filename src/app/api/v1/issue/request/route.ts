import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { user } = await validateRequest();
    const request = await db.request.create({
      data: {
        days: 1,
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
