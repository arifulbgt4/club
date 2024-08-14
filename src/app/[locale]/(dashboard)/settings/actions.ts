"use server";

import { revalidatePath } from "next/cache";
import db from "~/lib/db";
import { type payload } from "~/types";

export async function updateUser(id: string, payload: payload) {
  await db.user.update({
    where: { id },
    data: { ...payload },
  });

  revalidatePath("/settings");
}
