import { type IssueOptions } from "~/types";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function getAnIssue(id: string) {
  const { session, user } = await validateRequest();
  const dbIssue = await db.issue.findUnique({
    where: { id },
    include: { repo: true, user: true },
  });
  const octo = await app.getInstallationOctokit(
    Number(dbIssue?.user?.installId)
  );
  const issue = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: dbIssue?.user?.username as string,
      repo: dbIssue?.repo?.name as string,
      issue_number: Number(dbIssue?.issueNumber),
      headers: {
        authorization: `token ${dbIssue?.user?.accessToken}`,
      },
    }
  );

  const comments = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner: dbIssue?.user?.username as string,
      repo: dbIssue?.repo?.name as string,
      issue_number: Number(dbIssue?.issueNumber),
      headers: {
        authorization: `token ${dbIssue?.user?.accessToken}`,
      },
    }
  );
  return {
    issue: issue.data,
    comments: comments.data,
    isOwn: user?.id === dbIssue?.userId,
    isAuthenticated: !!session,
    dbIssue: dbIssue as IssueOptions,
  };
}
