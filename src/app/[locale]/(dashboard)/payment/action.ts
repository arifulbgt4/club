import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function checkConnect() {
  const { user } = await validateRequest();
  const account = await db.stripeAccount.findFirst({
    where: { userId: user?.id },
  });

  return !!account;
}
