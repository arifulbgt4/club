"use server";
import { type Session, type User } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TimeSpan, createDate } from "oslo";
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

export async function createEmailVerificationToken(
  userId: string,
  email: string
): Promise<string> {
  await db.emailVerificationToken.deleteMany({
    where: {
      userId,
    },
  });
  const newToken = await db.emailVerificationToken.create({
    data: {
      userId,
      email,
      expiresAt: createDate(new TimeSpan(3, "m")),
    },
  });
  return newToken.id;
}

export const octokit = cache(async () => {
  const { user, session } = await validateRequest();
  const accessTokenExpires = cookies().get("refresh")?.value || null;
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }
  const theUser = await db.user.findUnique({ where: { id: user?.id } });
  let token = theUser?.userAccessToken;

  if (Number(accessTokenExpires) < Date.now()) {
    const access_token = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: theUser?.refreshToken,
        }),
      }
    );
    const res_token = await access_token.json();
    const expiresTime = Date.now() + res_token?.expires_in;
    await db.user.update({
      where: { id: user?.id },
      data: {
        userAccessToken: res_token?.access_token,
        refreshToken: res_token?.refresh_token,
      },
    });
    token = res_token?.access_token;
    cookies().set("refresh", expiresTime.toString(), {
      path: "/",
      priority: "medium",
      expires: 365,
    });
  }
  return new Octokit({ auth: token });
});
