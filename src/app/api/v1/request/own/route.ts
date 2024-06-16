import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  try {
    const { user } = await validateRequest();
    const res = await db.request.findMany({
      where: { userId: user?.id, issue: { status: "published" } },
      include: {
        issue: {
          include: {
            user: { select: { name: true, picture: true, username: true } },
          },
        },
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
