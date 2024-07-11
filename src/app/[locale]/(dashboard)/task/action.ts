import { IssueState, IssueStatus, type Prisma } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

async function countIntents(where: Prisma.IntentWhereInput) {
  return db.intent.count({ where });
}

async function countRequests(where: Prisma.RequestWhereInput) {
  return db.request.count({ where });
}

export async function getCounts() {
  try {
    const { user } = await validateRequest();
    const userId = user?.id;

    const [inreview, reassigned, requests, completed, failed] =
      await Promise.all([
        countIntents({
          active: true,
          issue: { state: IssueState.inreview, status: IssueStatus.default },
          request: { userId },
        }),
        countIntents({
          active: true,
          issue: { state: IssueState.reassign, status: IssueStatus.queue },
          request: { userId },
        }),
        countRequests({
          userId,
          issue: { state: IssueState.published, status: IssueStatus.default },
        }),
        countIntents({
          active: false,
          success: true,
          issue: { status: IssueStatus.default },
          request: { userId },
        }),
        countIntents({
          active: false,
          success: false,
          issue: { status: IssueStatus.default },
          request: { userId },
        }),
      ]);

    return {
      reassigned: reassigned,
      requests: requests,
      inreview: inreview,
      completed: completed,
      failed: failed,
    };
  } catch (error) {
    console.log(error);
  }
}
