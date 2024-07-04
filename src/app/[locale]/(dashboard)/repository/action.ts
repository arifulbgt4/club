import type { Provider } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function getProviders() {
  const { user } = await validateRequest();
  const provider: Provider[] = await db.provider.findMany({
    where: { userId: user?.id },
  });
  return provider;
}
