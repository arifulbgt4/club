import { IssueState } from "@prisma/client";
import { validateRequest } from "~/server/auth";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { type IssueOptions } from "~/types";

export async function getAnIssue(id: string) {
  const { session, user } = await validateRequest();
  const dbIssue = await db.issue.findUnique({
    where: { id, active: true, state: IssueState.published },
    include: { intent: true, repository: { include: { provider: true } } },
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
        accept: "application/vnd.github.html+json",
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
        accept: "application/vnd.github.html+json",
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
