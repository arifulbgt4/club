import { NextResponse } from "next/server";
import db from "~/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const isPublished = await db.issue.findUnique({
    where: { id: String(id), published: true },
  });
  return NextResponse.json(!!isPublished);
}
