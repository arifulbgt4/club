import db from "~/lib/db";
import { octokit, validateRequest } from "~/server/auth";
import type { ProviderPublic } from "~/types";

export async function getRepository() {
  const { user } = await validateRequest();
  const repo = await db.repository.findMany({
    where: { userId: user?.id, active: true, delete: false },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          picture: true,
          active: true,
        },
      },
    },
  });
  return repo;
}

export async function getRepositoryByID(id: string) {
  const { user } = await validateRequest();

  const dbRepo = await db.repository.findUnique({
    where: { id, userId: user?.id, delete: false },
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          picture: true,
          active: true,
        },
      },
    },
  });

  if (!dbRepo) return null;

  const octo = await octokit();

  const gitRepo = await octo.request("GET /repos/{owner}/{repo}", {
    owner: dbRepo?.provider?.name,
    repo: dbRepo?.name,
  });

  return { dbRepo, gitRepo: gitRepo?.data };
}

export async function getProviders() {
  const { user } = await validateRequest();
  const provider = await db.provider.findMany({
    where: { userId: user?.id, active: true },
    select: {
      id: true,
      name: true,
      picture: true,
      active: true,
    },
  });
  return provider as ProviderPublic[];
}
