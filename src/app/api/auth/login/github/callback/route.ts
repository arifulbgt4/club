import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import db from "~/lib/db";
import { github, lucia } from "~/lib/lucia";
import { sendWelcomeEmail } from "~/server/mail";
import { app, privateKey } from "~/lib/octokit";

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const setup_action = url.searchParams.get("setup_action");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const installation_id = url.searchParams.get("installation_id");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (
    !setup_action &&
    (!code || !state || !storedState || state !== storedState)
  ) {
    return new Response(null, {
      status: 400,
    });
  } else if (setup_action === "install" && (!code || !installation_id)) {
    return new Response(null, {
      status: 400,
    });
  }

  let newAccessToken = null;

  try {
    const tokens = await github.validateAuthorizationCode(String(code));
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();
    const existingUser = await db.user.findUnique({
      where: {
        githubId: githubUser.id,
      },
    });

    if (setup_action === "install") {
      //** App installation */
      const accessToken = await app.octokit.request(
        "POST /app/installations/{installation_id}/access_tokens",
        {
          installation_id: Number(installation_id),
          headers: {
            authorization: `Bearer ${privateKey}`,
          },
        }
      );

      newAccessToken = accessToken.data.token;
    }

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      if (setup_action === "install") {
        await db.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            githubAccessToken: newAccessToken,
          },
        });
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/dashboard",
          },
        });
      }

      if (existingUser.githubAccessToken === null) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/dashboard/install",
          },
        });
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    const newUser = await db.user.create({
      data: {
        githubId: githubUser.id,
        name: githubUser.name,
        email: githubUser.email,
        picture: githubUser.avatar_url,
        githubAccessToken: newAccessToken,
      },
    });
    sendWelcomeEmail({ toMail: newUser.email!, userName: newUser.name! });
    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    if (setup_action === "install") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/dashboard",
        },
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard/install",
      },
    });
  } catch (e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};

interface GitHubUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
}
