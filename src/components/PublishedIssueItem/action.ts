import { app } from "~/lib/octokit";

export async function getIssue(
  repo: string,
  username: string,
  issueNumber: number,
  installId: number,
  token: string
) {
  //   console.log(repo, username, issueNumber, installId, token);
  const octo = await app.getInstallationOctokit(installId);
  const issue = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: username,
      repo: repo,
      issue_number: issueNumber,
      headers: {
        authorization: `token ${token}`,
      },
    }
  );
  return issue.data;
}
