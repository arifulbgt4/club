"use server";

import { type Organization, type User, type Repository } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "~/lib/db";
import { app } from "~/lib/octokit";
import { getUserSubscriptionPlan } from "~/lib/subscription";
import { validateRequest } from "~/server/auth";

interface Payload {
  name: string;
  domain: string;
}

export async function createProject(payload: Payload) {
  const { user } = await validateRequest();

  await db.project.create({
    data: {
      ...payload,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  revalidatePath(`/dashboard/repo`);
}

export async function checkIfFreePlanLimitReached() {
  const { user } = await validateRequest();
  const subscriptionPlan = await getUserSubscriptionPlan(user?.id as string);

  // If user is on a free plan.
  // Check if user has reached limit of 3 projects.
  if (subscriptionPlan?.isPro) return false;

  const count = await db.project.count({
    where: {
      userId: user?.id,
    },
  });

  return count >= 3;
}

const TAKE = 10;
export async function getRepositoryes(page: number, orgId?: string) {
  const { user } = await validateRequest();
  const repos = await db.repository.findMany({
    where: {
      userId: user?.id,
      ...(orgId ? { orgId } : { orgId: null }),
    },
    take: TAKE,
    skip: (page - 1) * TAKE,
    orderBy: {
      createdAt: "desc",
    },
  });
  const total = await db.repository.count({
    where: {
      userId: user?.id,
      ...(orgId ? { orgId } : { orgId: null }),
    },
  });

  return { repositorys: repos as Repository[], total, take: TAKE };
}

export async function getRepositoryById(id: string) {
  const { user } = await validateRequest();
  const repo = await db.repository.findFirst({
    where: {
      id,
      userId: user?.id,
    },
  });
  const octo = await app.getInstallationOctokit(Number(user?.installId));
  const repository = await octo.request("GET /repos/{owner}/{repo}", {
    owner: user?.username as string,
    repo: repo?.name as string,
    headers: {
      authorization: `token ${user?.accessToken}`,
    },
  });
  const issues = await octo.request("GET /repos/{owner}/{repo}/issues", {
    owner: user?.username as string,
    repo: repository?.data?.name as string,
    state: "open",
    sort: "updated",
    headers: {
      authorization: `token ${user?.accessToken}`,
    },
  });
  return {
    repository: repository.data,
    issues: issues.data.filter((i) => i?.author_association !== "NONE"),
  };
}

export async function updateProjectById(id: string, payload: Payload) {
  const { user } = await validateRequest();
  await db.project.update({
    where: {
      id,
      userId: user?.id,
    },
    data: payload,
  });
  revalidatePath(`/dashboard/repo`);
}

export async function deleteRepositoryById(id: string) {
  const { user } = await validateRequest();
  await db.issue.deleteMany({ where: { repoId: id, userId: user?.id } });
  await db.repository.delete({
    where: {
      id,
      userId: user?.id,
    },
  });
  revalidatePath(`/dashboard/repo`);
  redirect("/dashboard/repo");
}

export async function getOrganizations() {
  const { user } = await validateRequest();
  const organization = await db.organization.findMany({
    where: { userId: user?.id },
  });
  return { organization: organization as Organization[], user: user as User };
}

export async function publisheAnIssue({
  repoId,
  issueNumber,
  id,
  state,
}: {
  repoId?: string;
  issueNumber: number;
  state?: string;
  id: bigint;
}) {
  const { user } = await validateRequest();
  const issue = await db.issue.upsert({
    where: {
      id,
      userId: user?.id,
    },
    create: {
      id,
      issueNumber,
      state,
      repo: {
        connect: {
          id: repoId,
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
    update: {
      published: true,
    },
  });
  return issue;
}

export async function unpublishedAnIssue(id: bigint) {
  const { user } = await validateRequest();
  const issue = await db.issue.update({
    where: {
      id,
      userId: user?.id,
    },
    data: {
      published: false,
    },
  });
  return issue.id;
}

export async function checkAnIssue(gitIssueId: number) {
  const { user } = await validateRequest();
  const issue = await db.issue.findUnique({
    where: {
      id: BigInt(gitIssueId),
      userId: user?.id,
    },
  });
}
