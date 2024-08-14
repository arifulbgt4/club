import { IntentType } from "@prisma/client";
import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const issueId = searchParams.get("issueId");
  const issueType = searchParams.get("issueType");
  try {
    const { user, session } = await validateRequest();
    if (!session || !issueId || !issueType) {
      return new Response("Unauthorized", { status: 401 });
    }
    const getCount = await db.request.count({
      where: {
        userId: user?.id,
        intent: {
          type: IntentType.open_source,
          active: false,
          success: true,
        },
      },
    });
    const check = await db.request.findFirst({
      where: {
        issueId: issueId as string,
        userId: user?.id as string,
      },
    });

    const checkCount =
      (issueType === IntentType.paid && getCount >= 5) ||
      issueType === IntentType.open_source;

    const qualified = !check && checkCount;

    return NextResponse.json({
      qualified,
      count: getCount,
      applyed: !!check,
      applyedDay: check?.days || 0,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
