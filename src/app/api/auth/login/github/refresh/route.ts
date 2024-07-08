import { cookies } from "next/headers";
import db from "~/lib/db";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  const referer = req.headers.get("Referer");
  try {
    const { session, user } = await validateRequest();
    if (!session || !referer) {
      return new Response(null, { status: 401 });
    }
    const accessTokenExpires = cookies().get("refresh")?.value || null;

    const theUser = await db.user.findUnique({ where: { id: user?.id } });

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
      const expiresTime = Date.now() + res_token?.expires_in * 1000;
      await db.user.update({
        where: { id: user?.id },
        data: {
          accessToken: res_token?.access_token,
          refreshToken: res_token?.refresh_token,
        },
      });
      cookies().set("refresh", expiresTime.toString(), {
        path: "/",
        priority: "medium",
        maxAge: 15552000,
      });
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/repository",
      },
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
