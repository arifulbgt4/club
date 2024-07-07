import { app } from "~/lib/octokit";
import type { RepositoryOptions } from "~/types";

export async function getIssue(repo: RepositoryOptions, issueNumber: number) {
  const octo = await app.getInstallationOctokit(
    Number(repo?.provider?.installationId)
  );
  const issue = await octo.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}",
    {
      owner: repo?.provider?.name as string,
      repo: repo?.name as string,
      issue_number: issueNumber,
      headers: {
        authorization: `token ${repo?.provider?.accessToken}`,
      },
    }
  );
  return issue.data;
}
