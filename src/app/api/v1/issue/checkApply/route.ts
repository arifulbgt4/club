import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const issueId = searchParams.get("issueId");
  try {
    const { user } = await validateRequest();
    const check = await db.request.findFirst({
      where: {
        issueId: issueId as string,
        userId: user?.id as string,
      },
    });
    if (!!check) {
      return NextResponse.json(true);
    }
    return NextResponse.json(false);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
