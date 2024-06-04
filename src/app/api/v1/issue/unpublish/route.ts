import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const { user } = await validateRequest();
    await db.request.deleteMany({
      where: {
        issueId: id as string,
      },
    });
    await db.issue.delete({
      where: {
        id: id as string,
        userId: user?.id,
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
