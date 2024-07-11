import { IssueState, IssueStatus } from "@prisma/client";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function getInProgress() {
  const { user } = await validateRequest();
  const inprogressIntent = await db.intent.findFirst({
    where: {
      active: true,
      issue: {
        state: {
          in: [IssueState.inprogress, IssueState.reassign],
        },
        status: IssueStatus.default,
      },
      request: {
        userId: user?.id,
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
  if (!inprogressIntent) return null;

  const provider = inprogressIntent.issue?.repository?.provider;
  const octo = await app.getInstallationOctokit(
    Number(provider?.installationId)
  );

  const issue = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: provider?.name as string,
      repo: inprogressIntent?.issue?.repository?.name as string,
      issue_number: Number(inprogressIntent?.issue?.issueNumber),
      headers: {
        authorization: `token ${provider?.accessToken}`,
      },
    }
  );

  const comments = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner: provider?.name as string,
      repo: inprogressIntent?.issue?.repository?.name as string,
      issue_number: Number(inprogressIntent?.issue?.issueNumber),
      headers: {
        authorization: `token ${provider?.accessToken}`,
      },
    }
  );

  return {
    issue: issue.data,
    comments: comments.data,
    inprogress: {
      updatedAt: inprogressIntent?.updatedAt,
      userName: provider?.name,
      requestId: inprogressIntent.requestId,
      intentId: inprogressIntent.id,
      issueId: inprogressIntent.issueId,
      state: inprogressIntent?.issue?.state,
      previous_pr: inprogressIntent?.pr_number || 0,
    },
  };
}
