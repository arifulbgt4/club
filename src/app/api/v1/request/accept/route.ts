import { NextResponse } from "next/server";
import db from "~/lib/db";

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const acc = await db.request.update({
      where: {
        id: body?.id,
        issueId: body?.issueId,
        userId: body?.userId,
        approved: false,
        user: {
          available: true,
        },
      },
      data: {
        approved: true,
        user: {
          update: {
            available: false,
          },
        },
        issue: {
          update: {
            status: "inprogress",
            assigned: {
              connect: {
                id: body?.userId,
              },
            },
          },
        },
      },
    });
    await db.request.deleteMany({
      where: {
        issueId: body?.issueId,
        id: {
          not: body?.id,
        },
      },
    });
    return NextResponse.json(acc);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
