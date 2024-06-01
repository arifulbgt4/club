import { type Repository } from "@prisma/client";
import { NextResponse } from "next/server";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

const TAKE = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get("orgId");
  const page = Number(searchParams.get("page"));
  try {
    const { user } = await validateRequest();
    const repos = await db.repository.findMany({
      where: {
        userId: user?.id,
        ...(orgId ? { orgId } : { orgId: null }),
      },
      take: TAKE,
      skip: (page - 1) * TAKE,
      orderBy: {
        createdAt: "desc",
      },
    });
    const total = await db.repository.count({
      where: {
        userId: user?.id,
        ...(orgId ? { orgId } : { orgId: null }),
      },
    });
    return NextResponse.json({
      repositorys: repos as Repository[],
      total,
      take: TAKE,
    });
  } catch (error) {
    console.log(error);
    return new Response(null, { status: 500 });
  }
}
