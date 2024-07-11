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
        repositoryId: repoId,
        userId: user?.id,
      },
      include: {
        request: {
          where: {
            user: {
              available: true,
            },
          },
          take: 8,
          include: {
            user: {
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
