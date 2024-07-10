import { type IssueOptions } from "~/types";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";
import { IssueState } from "@prisma/client";

export async function getAnIssue(id: string) {
  const { session, user } = await validateRequest();
  const dbIssue = await db.issue.findUnique({
    where: { id, active: true, state: IssueState.published },
    include: { repository: { include: { provider: true } } },
  });

  if (!dbIssue) {
    return null;
  }

  const provider = dbIssue?.repository?.provider;
  const octo = await app.getInstallationOctokit(
    Number(provider?.installationId)
  );
  const issue = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: provider?.name as string,
      repo: dbIssue?.repository?.name as string,
      issue_number: Number(dbIssue?.issueNumber),
      headers: {
        authorization: `token ${provider?.accessToken}`,
      },
    }
  );

  if (!issue?.data) {
    return null;
  }

  const comments = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner: provider?.name as string,
      repo: dbIssue?.repository?.name as string,
      issue_number: Number(dbIssue?.issueNumber),
      headers: {
        authorization: `token ${provider?.accessToken}`,
      },
    }
  );

  return {
    issue: issue.data,
    comments: comments?.data,
    isOwn: user?.id === dbIssue?.userId,
    isAuthenticated: !!session,
    dbIssue: dbIssue as IssueOptions,
  };
}
