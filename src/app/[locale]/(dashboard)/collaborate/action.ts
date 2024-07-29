import db from "~/lib/db";
import { octokit, validateRequest } from "~/server/auth";

export default async function getCollaborate() {
  const { user } = await validateRequest();

  const collaborate = await db.collaborate.findMany({
    where: {
      userId: user?.id,
      active: true,
      repository: {
        active: true,
        private: true,
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

export async function getCollaborateByID(id: string) {
  const { user } = await validateRequest();

  const collaborate = await db.collaborate.findUnique({
    where: { id, userId: user?.id, repository: { private: true } },
    include: {
      repository: {
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              picture: true,
            },
          },
        },
      },
    },
  });

  if (!collaborate) return null;
  const repo = collaborate?.repository;
  const octo = await octokit();

  const gitRepo = await octo.request("GET /repos/{owner}/{repo}", {
    owner: repo?.provider?.name,
    repo: repo?.name,
  });

  return { dbRepo: repo, gitRepo: gitRepo?.data };
}
