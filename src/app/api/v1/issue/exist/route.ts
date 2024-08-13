import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const { user, session } = await validateRequest();
    if (!session || !id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const issue = await db.issue.findUnique({
      where: {
        id,
        userId: user?.id,
        active: true,
      },
      include: {
        intent: {
          where: { active: true },
        },
      },
    });
    if (!issue) {
      return new Response(JSON.stringify({ is_exist: false }), { status: 200 });
    }
    const assign = await db.request.findUnique({
      where: { id: issue?.intent[0]?.requestId || "" },
      include: {
        user: {
          select: {
            username: true,
            githubId: true,
            picture: true,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({ is_exist: true, issue, assign: assign?.user || null }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(null, {
      status: 500,
    });
  }
}
