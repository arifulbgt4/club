import db from "~/lib/db";
import { octokit, validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoId = searchParams.get("repoId");
  try {
    const { user, session } = await validateRequest();
    if (!session || !repoId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const repo = await db.repository.findUnique({ where: { id: repoId } });
    if (!repo) {
      return new Response("Unauthorized", { status: 401 });
    }

    const octo = await octokit();
    const res = await octo.request("GET /repos/{owner}/{repo}/collaborators", {
      repo: repo.name,
      owner: user?.username,
    });

    return new Response(JSON.stringify(res.data), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
