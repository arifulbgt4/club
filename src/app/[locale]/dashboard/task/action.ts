import { RequestState } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getCounts() {
  try {
    const { user } = await validateRequest();

    // Use a single query with aggregation
    const counts = await db.request.groupBy({
      by: ["state"],
      _count: {
        state: true,
      },
      where: { userId: user?.id },
    });

    // Initialize counts object with all states set to 0
    const result = {
      reassigned: 0,
      requests: 0,
      inreview: 0,
      completed: 0,
      failed: 0,
    };

    // Map the counts to the corresponding state
    counts.forEach(({ state, _count }) => {
      switch (state) {
        case RequestState.reassign:
          result.reassigned = _count.state;
          break;
        case RequestState.open:
          result.requests = _count.state;
          break;
        case RequestState.inreview:
          result.inreview = _count.state;
          break;
        case RequestState.completed:
          result.completed = _count.state;
          break;
        case RequestState.failed:
          result.failed = _count.state;
          break;
      }
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}
