import octokit from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  try {
    const { session } = await validateRequest();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const octo = await octokit();

    const topics = await octo.request("GET /search/topics", {
      q: query as string,
    });

    return new Response(JSON.stringify(topics.data.items), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
