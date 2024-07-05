import db from "~/lib/db";
import octokit from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const r = searchParams.get("r");
  try {
    const { session } = await validateRequest();
    if (!session || !r) {
      return new Response("Unauthorized", { status: 401 });
    }

    const repository = await db.repository.findUnique({ where: { id: r } });

    if (!repository) {
      return new Response("Unauthorized", { status: 401 });
    }

    const octo = await octokit();

    const issues = await octo.request("GET /search/issues", {
      q: `${query} repo:${repository.fullName} type:issue is:open` as string,
      sort: "updated",
      order: "desc",
      per_page: 5,
      page: 1,
    });
    return new Response(JSON.stringify(issues?.data?.items), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
