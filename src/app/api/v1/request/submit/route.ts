import { IssueState, RequestState } from "@prisma/client";
import { NextResponse } from "next/server";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function PUT(req: Request) {
  const body = await req.json();
  try {
    const { user } = await validateRequest();
    const request = await db.request.findUnique({
      where: {
        id: body?.id,
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

    const provider = request?.issue?.repository?.provider;

    const repo = request?.issue?.repository;

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
      return new Response(null, { status: 400 });
    }
    const res = await db.request.update({
      where: {
        id: body?.id,
        userId: user?.id,
        issueId: request?.issueId,
      },
      data: {
        state: RequestState.inreview,
        issue: {
          update: {
            prNumber: Number(body?.prNumber),
            state: IssueState.inreview,
          },
        },
        user: {
          update: {
            available: true,
          },
        },
      },
    });
    return NextResponse.json(res);
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
