import db from "~/lib/db";
import { octokit, validateRequest } from "~/server/auth";

export default async function getCollaborate() {
  const { user } = await validateRequest();

  const collaborate = await db.collaborate.findMany({
    where: {
      userId: user?.id,
      accept: true,
      active: true,
      repository: {
        active: true,
      },
    },
    include: {
      repository: {
        include: {
          provider: {
            select: {
              name: true,
              picture: true,
            },
          },
        },
      },
    },
  });

  return collaborate;
}

export async function getRepositoryByID(id: string) {
  const { user } = await validateRequest();

  const dbRepo = await db.repository.findUnique({
    where: { id },
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
