import { type Organization } from "@prisma/client";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { validateRequest } from "~/server/auth";

export async function getOrgsRepos(id: string) {
  const org = await db.organization.findUnique({ where: { id } });
  const octo = await app.getInstallationOctokit(Number(org?.installId));
  const repo = await octo.request("GET /installation/repositories", {
    per_page: 100,
    page: 1,
    headers: {
      authorization: `token ${org?.token}`,
    },
  });
  return repo.data.repositories;
}

export async function getUserRepos() {
  const { user } = await validateRequest();
  const octo = await app.getInstallationOctokit(Number(user?.installId));
  const repo = await octo.request("GET /installation/repositories", {
    per_page: 100,
    page: 1,
    headers: {
      authorization: `token ${user?.accessToken}`,
    },
  });
  return repo.data.repositories;
}

export async function getOrganizations() {
  const { user } = await validateRequest();
  const organization = await db.organization.findMany({
    where: { userId: user?.id },
  });
  return organization as Organization[];
}
