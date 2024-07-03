import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const queryUser = searchParams.get("u");
  try {
    const { session, user } = await validateRequest();
    if (!session || !user?.stripeCustomerId) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!queryUser && queryUser !== user?.username) {
      return new Response("Unauthorized", { status: 401 });
    }

    const octo = await app.getInstallationOctokit(Number(user?.installId));

    const user_repositories = await octo.request("GET /search/repositories", {
      q: `${query} user:${user?.username}` as string,
      sort: "updated",
      order: "desc",
      per_page: 10,
      page: 1,
      headers: {
        authorization: `token ${user?.accessToken}`,
      },
    });
    return new Response(JSON.stringify(user_repositories.data.items), {
      status: 200,
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
