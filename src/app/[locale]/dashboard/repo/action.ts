"use server";

import {
  type Project,
  type Organization,
  type User,
  type Repository,
} from "@prisma/client";
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

export async function getProjects() {
  const { user } = await validateRequest();
  const projects = await db.repository.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects as Repository[];
}

export async function getRepositoryById(id: string) {
  const { user } = await validateRequest();
  const project = await db.repository.findFirst({
    where: {
      id,
      userId: user?.id,
    },
  });
  return project as Repository;
}

export async function getRepoIssues(repo: string) {
  const { user } = await validateRequest();
  const octo = await app.getInstallationOctokit(Number(user?.installId));
  const issues = await octo.request("GET /repos/{owner}/{repo}/issues", {
    owner: user?.username as string,
    repo,
    state: "open",
    headers: {
      authorization: `token ${user?.accessToken}`,
    },
  });
  return issues.data.filter((i) => i?.author_association !== "NONE");
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

export async function deleteProjectById(id: string) {
  const { user } = await validateRequest();
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

export async function createIssue({
  title,
  body,
  repoId,
  issueNumber,
}: {
  title: string;
  body?: string;
  repoId?: string;
  issueNumber: number;
}) {
  const { user } = await validateRequest();
  const issue = await db.issue.create({
    data: {
      title,
      body,
      issueNumber,
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
  });
  return issue;
}
