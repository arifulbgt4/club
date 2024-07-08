import db from "~/lib/db";
import { octokit, validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { session, user } = await validateRequest();
    if (!session || !body?.p || !body?.name) {
      return new Response("Unauthorized", { status: 401 });
    }
    const provider = await db.provider.findUnique({ where: { id: body?.p } });

    if (!provider) {
      return new Response("Unauthorized", { status: 402 });
    }

    const octo = await octokit();
    const repo = await octo.request("GET /repos/{owner}/{repo}", {
      owner: provider.name,
      repo: body?.name,
    });

    if (repo?.status !== 200) {
      return new Response("No repository found", { status: 403 });
    }

    const pub = await db.repository.upsert({
      where: { id: String(repo?.data?.id) },
      create: {
        id: String(repo?.data?.id),
        name: repo?.data?.name,
        fullName: repo?.data?.full_name,
        private: Boolean(repo?.data?.private),
        language: repo?.data?.language,
        topics: repo?.data?.topics,
        user: {
          connect: {
            id: user?.id,
          },
        },
        provider: {
          connect: {
            id: provider.id,
          },
        },
      },
      update: {
        active: true,
        name: repo?.data?.name,
        fullName: repo?.data?.full_name,
        private: Boolean(repo?.data?.private),
        language: repo?.data?.language,
        topics: repo?.data?.topics,
      },
    });

    return new Response(JSON.stringify(pub?.id), { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
