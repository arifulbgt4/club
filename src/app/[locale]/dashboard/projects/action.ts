"use server";

import { type Project, type Organization, type User } from "@prisma/client";
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

  revalidatePath(`/dashboard/projects`);
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
  const projects = await db.project.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects as Project[];
}

export async function getProjectById(id: string) {
  const { user } = await validateRequest();
  const project = await db.project.findFirst({
    where: {
      id,
      userId: user?.id,
    },
  });
  return project as Project;
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
  revalidatePath(`/dashboard/projects`);
}

export async function deleteProjectById(id: string) {
  const { user } = await validateRequest();
  await db.project.delete({
    where: {
      id,
      userId: user?.id,
    },
  });
  revalidatePath(`/dashboard/projects`);
  redirect("/dashboard/projects");
}

export async function getOrganizations() {
  const { user } = await validateRequest();
  const organization = await db.organization.findMany({
    where: { userId: user?.id },
  });
  return { organization: organization as Organization[], user: user as User };
}

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
