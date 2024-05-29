import db from "~/lib/db";
import { app } from "~/lib/octokit";

export async function getAnIssue(id: bigint) {
  const issueDB = await db.issue.findUnique({
    where: { id },
    include: { repo: true, user: true },
  });
  const octo = await app.getInstallationOctokit(
    Number(issueDB?.user?.installId)
  );
  const issue = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: issueDB?.user?.username as string,
      repo: issueDB?.repo?.name as string,
      issue_number: Number(issueDB?.issueNumber),
      headers: {
        authorization: `token ${issueDB?.user?.accessToken}`,
      },
    }
  );
  return issue.data;
}
