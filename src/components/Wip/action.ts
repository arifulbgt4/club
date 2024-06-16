import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function getInProgress() {
  const { user } = await validateRequest();
  const inprogress = await db.request.findFirst({
    where: {
      userId: user?.id,
      approved: true,
      issue: { assignedId: user?.id, status: "inprogress" },
    },
    include: {
      issue: {
        include: {
          user: {
            select: {
              name: true,
              username: true,
              picture: true,
              installId: true,
              accessToken: true,
            },
          },
          repo: true,
        },
      },
    },
  });

  const octo = await app.getInstallationOctokit(
    Number(inprogress?.issue?.user?.installId)
  );

  const issue = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: inprogress?.issue?.user?.username as string,
      repo: inprogress?.issue?.repo?.name as string,
      issue_number: Number(inprogress?.issue?.issueNumber),
      headers: {
        authorization: `token ${inprogress?.issue?.user?.accessToken}`,
      },
    }
  );

  const comments = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner: inprogress?.issue?.user?.username as string,
      repo: inprogress?.issue?.repo?.name as string,
      issue_number: Number(inprogress?.issue?.issueNumber),
      headers: {
        authorization: `token ${inprogress?.issue?.user?.accessToken}`,
      },
    }
  );

  return {
    issue: issue.data,
    comments: comments.data,
    inprogress: {
      id: inprogress?.id,
      updatedAt: inprogress?.updatedAt,
      userName: inprogress?.issue?.user?.username,
    },
  };
}
