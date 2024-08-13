import { type IntentType, IssueState } from "@prisma/client";
import db from "~/lib/db";
import { redirectError } from "~/lib/utils";
import { octokit, validateRequest } from "~/server/auth";
import { ASSIGN_TYPE } from "~/types";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { user, session } = await validateRequest();
    if (!session || !body?.issueNumber) {
      return new Response("Unauthorized", { status: 401 });
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

    const newIssue = await db.issue.upsert({
      where: {
        id: String(issue?.data?.id),
        userId: user?.id,
      },
      create: {
        id: String(issue?.data?.id),
        title: issue?.data?.title,
        issueNumber: Number(issue?.data?.number),
        state: IssueState.draft,
        topics: [...body?.topics],
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
        title: issue?.data?.title,
        state: IssueState.draft,
        topics: [...body?.topics],
        active: true,
      },
    });

    const intentId = await db.intent.findFirst({
      where: { issueId: newIssue?.id },
    });

    const newIntent = await db.intent.upsert({
      where: {
        id: String(intentId) || "",
      },
      create: {
        issue: {
          connect: {
            id: newIssue?.id,
          },
        },
        type: body.type as IntentType,
      },
      update: {
        type: body.type as IntentType,
      },
    });

    if (repo?.private && body?.assignType === ASSIGN_TYPE.collaborator) {
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    redirectError(error);
    return new Response(null, {
      status: 500,
    });
  }
}
