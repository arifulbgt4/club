import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoId = searchParams.get("repoId");
  try {
    const { user } = await validateRequest();
    const getall = await db.issue.findMany({
      where: {
        repoId,
        published: true,
        userId: user?.id,
      },
      include: {
        request: {
          take: 8,
          include: {
            user: {
              where: { available: true },
              select: { id: true, picture: true, username: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(getall);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
