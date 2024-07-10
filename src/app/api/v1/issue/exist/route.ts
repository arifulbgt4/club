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
        assigned: {
          select: {
            id: true,
            name: true,
            username: true,
            picture: true,
          },
        },
        request: {
          where: {
            approved: true,
          },
        },
      },
    });
    if (!issue) {
      return new Response(JSON.stringify({ is_exist: false }), { status: 200 });
    }
    return new Response(JSON.stringify({ is_exist: true, issue }), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, {
      status: 500,
    });
  }
}
