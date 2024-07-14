"use server";
import { type Session, type User } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import db from "~/lib/db";
import { Octokit } from "octokit";
import { lucia } from "~/lib/lucia";

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
}

export const octokit = cache(async () => {
  const { user, session } = await validateRequest();
  const accessTokenExpires = cookies().get("refresh")?.value || null;

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  if (Number(accessTokenExpires) < Date.now()) {
    return redirect("/api/auth/login/github/refresh/");
  }
  const account = await db.account.findUnique({
    where: { userId: user?.id },
    select: { accessToken: true },
  });

  return new Octokit({ auth: account?.accessToken });
});
