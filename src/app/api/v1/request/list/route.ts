import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const issueId = searchParams.get("issueId");
  try {
    const { user } = await validateRequest();
    const requests = await db.request.findMany({
      where: {
        issueId: issueId,
        issue: {
          userId: user?.id,
        },
        user: {
          available: true,
        },
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json(requests);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
