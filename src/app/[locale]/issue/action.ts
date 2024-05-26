import db from "~/lib/db";
import { app } from "~/lib/octokit";

export async function getAnIssue(id: string) {
  const issueDB = await db.issue.findUnique({ where: { id } });
  const issueUser = await db.user.findUnique({
    where: { id: issueDB?.userId as string },
  });
  const repo = await db.repository.findUnique({
    where: { id: issueDB?.repoId as string },
  });
  const octo = await app.getInstallationOctokit(Number(issueUser?.installId));
  const issue = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: issueUser?.username as string,
      repo: repo?.name as string,
      issue_number: Number(issueDB?.issueNumber),
      headers: {
        authorization: `token ${issueUser?.accessToken}`,
      },
    }
  );
  return issue.data;
}
