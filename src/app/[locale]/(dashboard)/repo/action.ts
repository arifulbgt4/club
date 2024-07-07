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

export async function getRepositoryById(id: string) {
  const { user } = await validateRequest();
  const repo = await db.repository.findUnique({
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
  return repository.data;
}

export async function deleteRepositoryById(id: string) {
  const { user } = await validateRequest();
  // TODO: need to delete request when delete issues
  await db.issue.deleteMany({ where: { repositoryId: id, userId: user?.id } });
  await db.repository.delete({
    where: {
      id,
      userId: user?.id,
    },
  });
  revalidatePath(`/repo`);
  redirect("/repo");
}

export async function getOrganizations() {
  const { user } = await validateRequest();
  const organization = await db.organization.findMany({
    where: { userId: user?.id },
  });
  return { organization: organization as Organization[], user: user as User };
}
