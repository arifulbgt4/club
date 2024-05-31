import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const { user } = await validateRequest();
    await db.issue.update({
      where: {
        id: BigInt(body?.id),
        userId: user?.id,
      },

      data: {
        published: false,
      },
    });
    return NextResponse.json(true);
  } catch (error) {
    console.log(error);

    return new Response(null, {
      status: 500,
    });
  }
}
