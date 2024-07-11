import { IssueState, IssueStatus } from "@prisma/client";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const { user, session } = await validateRequest();
    if (!session || !body?.issueId || !body?.intentId || !body?.requestId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const intent = await db.intent.findUnique({
      where: {
        id: body?.intentId,
        active: true,
        issue: {
          id: body?.issueId,
          state: IssueState.inprogress,
          status: IssueStatus.default,
        },
        request: {
          id: body?.requestId,
        },
      },
      include: {
        issue: {
          include: {
            repository: {
              include: {
                provider: true,
              },
            },
          },
        },
      },
    });

    const provider = intent?.issue?.repository?.provider;

    const repo = intent?.issue?.repository;

    const octo = await app.getInstallationOctokit(
      Number(provider?.installationId)
    );

    const pull = await octo.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner: provider?.name as string,
        repo: repo?.name as string,
        pull_number: Number(body?.prNumber),
        headers: {
          authorization: `token ${provider?.accessToken}`,
        },
      }
    );
    if (
      pull?.data?.state !== "open" &&
      pull?.data?.user?.login !== user?.username &&
      pull?.data?.base?.repo?.name !== repo?.name &&
      !pull?.data?.merged
    ) {
      return new Response(`Wrong pull request #${body?.prNumber}`, {
        status: 401,
      });
    }

    await db.intent.update({
      where: {
        id: body?.id,
        issueId: intent?.issueId,
        requestId: intent?.requestId as string,
      },
      data: {
        pr_number: Number(body?.prNumber),
        issue: {
          update: {
            state: IssueState.inreview,
          },
        },
        request: {
          update: {
            user: {
              update: {
                available: true,
              },
            },
          },
        },
      },
    });

    const isQueue = await db.intent.findMany({
      where: {
        issue: {
          state: {
            in: [IssueState.inprogress, IssueState.reassign],
          },
          status: IssueStatus.queue,
        },
        request: {
          userId: user?.id,
        },
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    if (!!isQueue?.length) {
      const queueIntent = isQueue[0];
      await db.intent.update({
        where: {
          id: queueIntent.id,
          issue: {
            status: IssueStatus.queue,
          },
        },
        data: {
          issue: {
            update: {
              state: IssueState.inprogress,
              status: IssueStatus.default,
            },
          },
          request: {
            update: {
              user: {
                update: {
                  available: false,
                },
              },
            },
          },
        },
      });
    }

    return new Response("Submit successfully", { status: 200 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
