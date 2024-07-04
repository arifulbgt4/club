import type { Provider } from "@prisma/client";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";
import type { ProviderPublic } from "~/types";

export async function getProviders() {
  const { user } = await validateRequest();
  const provider = await db.provider.findMany({
    where: { userId: user?.id },
    select: {
      id: true,
      name: true,
      picture: true,
      active: true,
    },
  });
  return provider as ProviderPublic[];
}
