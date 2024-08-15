import db from "~/lib/db";
import { redirectError } from "~/lib/utils";
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
        delete: false,
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
    });

    await db.issue.updateMany({
      where: { repositoryId: pub?.id, active: false },
      data: {
        active: true,
      },
    });

    const collaborators = await octo.request(
      "GET /repos/{owner}/{repo}/collaborators",
      {
        owner: repo?.data?.owner?.login,
        repo: repo?.data?.name,
      }
    );

    if (!!collaborators?.data?.length) {
      const repoCollaborators = await db.collaborate.findMany({
        where: { repositoryId: pub?.id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collaborators?.data?.forEach(async (e: any) => {
        if (e?.role_name !== "admin") {
          const contriId = repoCollaborators.find(
            (v) => v.user?.username === e?.login
          );

          const gitUser = await octo.request("GET /users/{username}", {
            username: e?.login,
          });

          const findUser = await db.user.upsert({
            where: { githubId: String(e?.id) },
            create: {
              name: gitUser?.data?.name ?? gitUser?.data?.login,
              username: gitUser?.data?.login,
              picture: gitUser?.data?.avatar_url,
              githubId: String(gitUser?.data?.id),
              email: gitUser?.data?.email ?? null,
              bio: gitUser?.data?.bio ?? null,
              active: false,
              available: false,
              inactive: true,
              account: {
                create: {},
              },
            },
            update: {
              name: gitUser?.data?.name ?? gitUser?.data?.login,
              username: gitUser?.data?.login,
              picture: gitUser?.data?.avatar_url,
              bio: gitUser?.data?.bio ?? null,
            },
          });
          if (pub?.private) {
            await db.collaborate.upsert({
              where: {
                id: contriId?.id ?? "",
              },
              create: {
                repository: {
                  connect: {
                    id: pub?.id,
                  },
                },
                user: {
                  connect: {
                    id: findUser?.id,
                  },
                },
                active: true,
              },
              update: {
                active: true,
              },
            });
          }
        }
      });
    }

    return new Response(JSON.stringify(pub?.id), { status: 200 });
  } catch (error) {
    redirectError(error);
    return new Response(null, { status: 500 });
  }
}
