import { IssueState } from "@prisma/client";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { redirectError } from "~/lib/utils";
import { octokit, validateRequest } from "~/server/auth";

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const { session, user } = await validateRequest();
    if (!session || !body?.issueId || !body?.intentId || !body?.requestId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const issue = await db.issue.findUnique({
      where: { id: String(body?.issueId) },
      include: {
        repository: {
          include: {
            provider: true,
          },
        },
      },
    });

    if (!issue) {
      return new Response("Unauthorized", { status: 401 });
    }
    const repo = issue?.repository;

    if (!repo?.provider?.active) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (repo?.private) {
      const requestUser = await db.request.findUnique({
        where: { id: body?.requestId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      const octo = await octokit();

      try {
        await octo.request(
          "GET /repos/{owner}/{repo}/collaborators/{username}",
          {
            owner: user?.username,
            repo: repo.name,
            username: requestUser?.user?.username,
          }
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.status === 404) {
          const gitApp = await app.getInstallationOctokit(
            Number(repo.provider?.installationId)
          );
          await gitApp.request(
            "PUT /repos/{owner}/{repo}/collaborators/{username}",
            {
              owner: user?.username,
              repo: repo.name as string,
              username: requestUser?.user?.username as string,
              permission: "read",
              headers: {
                authorization: `token ${repo?.provider?.accessToken}`,
              },
            }
          );
        }
      }
    }

    const update = await db.intent.update({
      where: {
        id: body?.intentId,
      },
      data: {
        request: {
          connect: {
            id: body?.requestId,
          },
        },
        issue: {
          update: {
            state: IssueState.inprogress,
          },
        },
      },
    });

    if (!update) {
      return new Response("Wrong information", { status: 401 });
    }

    await db.request.update({
      where: { id: body.requestId },
      data: { user: { update: { available: false } } },
    });

    await db.request.deleteMany({
      where: {
        id: {
          not: body?.requestId,
        },
        issueId: body?.issueId,
      },
    });

    return new Response("success", { status: 200 });
  } catch (error) {
    redirectError(error);
    return new Response(null, { status: 500 });
  }
}
