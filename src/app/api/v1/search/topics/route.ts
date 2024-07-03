import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  try {
    const { session, user } = await validateRequest();
    if (!session || !user?.stripeCustomerId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const octo = await app.getInstallationOctokit(Number(user?.installId));
    const topics = await octo.request("GET /search/topics", {
      q: query as string,
      headers: {
        authorization: `token ${user?.accessToken}`,
      },
    });
    return new Response(JSON.stringify(topics.data.items), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
