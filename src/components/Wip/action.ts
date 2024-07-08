import { IssueState, RequestState } from "@prisma/client";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function getInProgress() {
  const { user } = await validateRequest();
  const inprogress = await db.request.findFirst({
    where: {
      userId: user?.id,
      approved: true,
      state: RequestState.inprogress,
      issue: { assignedId: user?.id, state: IssueState.inprogress },
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
  if (!inprogress) return null;

  const provider = inprogress.issue?.repository?.provider;
  const octo = await app.getInstallationOctokit(
    Number(provider?.installationId)
  );

  const issue = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: provider?.name as string,
      repo: inprogress?.issue?.repository?.name as string,
      issue_number: Number(inprogress?.issue?.issueNumber),
      headers: {
        authorization: `token ${provider?.accessToken}`,
      },
    }
  );

  const comments = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner: provider?.name as string,
      repo: inprogress?.issue?.repository?.name as string,
      issue_number: Number(inprogress?.issue?.issueNumber),
      headers: {
        authorization: `token ${provider?.accessToken}`,
      },
    }
  );

  return {
    issue: issue.data,
    comments: comments.data,
    inprogress: {
      id: inprogress?.id,
      updatedAt: inprogress?.updatedAt,
      userName: provider?.name,
    },
  };
}
