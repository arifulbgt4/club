"use server";
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

  if (repo.data.total_count <= 100) {
    return repo.data.repositories;
  }
  const getval = [...repo.data.repositories];
  for (let index = 1; index < Math.ceil(repo.data.total_count / 100); index++) {
    const a = await octo.request("GET /installation/repositories", {
      per_page: 100,
      page: 1 + index,
      headers: {
        authorization: `token ${org?.token}`,
      },
    });
    getval.push(...a.data.repositories);
  }
  return getval.reverse();
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

  if (repo.data.total_count <= 100) {
    return repo.data.repositories;
  }
  const getval = [...repo.data.repositories];
  for (let index = 1; index < Math.ceil(repo.data.total_count / 100); index++) {
    const a = await octo.request("GET /installation/repositories", {
      per_page: 100,
      page: 1 + index,
      headers: {
        authorization: `token ${user?.accessToken}`,
      },
    });
    getval.push(...a.data.repositories);
  }
  return getval.reverse();
}

export async function getOrganizations() {
  const { user } = await validateRequest();
  const organization = await db.organization.findMany({
    where: { userId: user?.id },
  });
  return organization as Organization[];
}

export async function createRepo({
  name,
  fullName,
  language,
  isPrivate,
}: {
  name: string;
  fullName: string;
  language: string;
  isPrivate: boolean;
}) {
  const { user } = await validateRequest();

  const cr = await db.repository.create({
    data: {
      name,
      fullName,
      language,
      private: isPrivate,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  return cr.id;
}
