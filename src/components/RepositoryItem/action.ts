import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function getARepository(id: string, repoName: string) {
  const { user } = await validateRequest();
  const octo = await app.getInstallationOctokit(Number(user?.installId));
  const repo = await octo.request("GET /repos/{owner}/{repo}", {
    owner: user?.username as string,
    repo: repoName,
    headers: {
      authorization: `token ${user?.accessToken}`,
    },
  });
  return repo.data;
}
