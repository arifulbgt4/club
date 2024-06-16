import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getCounts() {
  try {
    const { user } = await validateRequest();
    const total_request = await db.request.count({
      where: { userId: user?.id, approved: false },
    });
    return { total_request };
  } catch (error) {
    console.log(error);
  }
}
