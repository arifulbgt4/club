"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { IssueState } from "@prisma/client";
import db from "~/lib/db";

export async function deleteRepositoryById(id: string) {
  const isIssueExist = await db.issue.count({
    where: {
      repositoryId: id,
      state: {
        in: [IssueState.inprogress, IssueState.inreview, IssueState.reassign],
      },
    },
  });

  if (isIssueExist > 0) {
    return {
      message: "You have active issues, not be able to delete the repository",
      status: 300,
    };
  }
  await db.repository.update({ where: { id }, data: { active: false } });
  revalidatePath(`/repository`);
  redirect("/repository");
}
