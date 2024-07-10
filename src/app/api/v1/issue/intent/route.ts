import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const { session } = await validateRequest();
    if (!session || !id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const intent = await db.intent.findUnique({
      where: {
        id,
        active: true,
      },
      include: {
        issue: true,
        request: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                picture: true,
              },
            },
          },
        },
      },
    });
    if (!intent) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(JSON.stringify(intent), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, {
      status: 500,
    });
  }
}
