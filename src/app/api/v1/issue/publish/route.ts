import { IntentType, IssueState, IssueStatus } from "@prisma/client";
import { siteConfig } from "~/config/site";
import db from "~/lib/db";
import { redirectError } from "~/lib/utils";
import { octokit, validateRequest } from "~/server/auth";
import { ASSIGN_TYPE } from "~/types";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { user, session } = await validateRequest();
    if (!session || !body?.issueNumber || !body?.type) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (
      body?.type === IntentType.paid &&
      body?.price < siteConfig().minimumAmount
    ) {
      return new Response(
        `Price required minimum $${siteConfig().minimumAmount}`,
        { status: 401 }
      );
    }

    if (body?.topics?.length > 10 || !body?.topics?.length) {
      return new Response("An issue can have a maximum of 9 topics", {
        status: 401,
      });
    }

    const repo = await db.repository.findUnique({
      where: { id: body.repoId, userId: user?.id },
      include: { provider: true },
    });

    if (!repo) {
      return new Response("Unauthorized", { status: 401 });
    }

    const octo = await octokit();
    const issue = await octo.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}",
      {
        owner: repo?.provider?.name,
        repo: repo?.name,
        issue_number: Number(body?.issueNumber),
      }
    );

    const published = await db.issue.upsert({
      where: {
        id: String(issue?.data?.id),
        userId: user?.id,
      },
      create: {
        id: String(issue?.data?.id),
        title: issue?.data?.title,
        issueNumber: Number(issue?.data?.number),
        state:
          body?.assignType === ASSIGN_TYPE.collaborator
            ? IssueState.inprogress
            : IssueState.published,
        topics: [...body?.topics],
        status: IssueStatus.default,
        repository: {
          connect: {
            id: repo?.id,
          },
        },
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
      update: {
        active: true,
        state:
          body?.assignType === ASSIGN_TYPE.collaborator
            ? IssueState.inprogress
            : IssueState.published,
        title: issue?.data?.title,
        topics: [...body?.topics],
      },
    });

    await db.intent.updateMany({
      where: {
        active: true,
        issueId: published?.id,
      },
      data: {
        type: body.type as IntentType,
        ...(body?.type === IntentType.paid
          ? { price: body?.price }
          : { price: null }),
      },
    });

    return new Response(JSON.stringify(published), { status: 200 });
  } catch (error) {
    redirectError(error);
    return new Response(null, {
      status: 500,
    });
  }
}
