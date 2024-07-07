import { OwnerTypeState } from "@prisma/client";
import db from "~/lib/db";
import { octokit, validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const id = searchParams.get("s");
  try {
    const { session } = await validateRequest();
    if (!session || !id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const provider = await db.provider.findUnique({ where: { id } });

    if (!provider) {
      return new Response("Unauthorized", { status: 401 });
    }

    const ownerType =
      provider.ownerType === OwnerTypeState.organization ? "org" : "user";

    const octo = await octokit();

    const user_repositories = await octo.request("GET /search/repositories", {
      q: `${query} ${ownerType}:${provider.name}` as string,
      sort: "updated",
      order: "desc",
      per_page: 5,
      page: 1,
    });
    return new Response(JSON.stringify(user_repositories.data.items), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
