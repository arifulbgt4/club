import { OwnerTypeState } from "@prisma/client";
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import db from "~/lib/db";
import { lucia } from "~/lib/lucia";
// import { sendWelcomeEmail } from "~/server/mail";
import { app, privateKey } from "~/lib/octokit";
import { stripe } from "~/lib/stripe";

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
  let install;

  try {
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
          code,
          redirect_uri: "http://localhost:3000/api/auth/login/github/callback/",
        }),
      }
    );
    const res_token = await access_token.json();
    if (
      res_token?.error ||
      !res_token?.access_token ||
      !res_token?.refresh_token
    ) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/login",
        },
      });
    }

    // const tokens = await github.validateAuthorizationCode(String(code));
    const tokens = {
      accessToken: res_token?.access_token,
      refreshToken: res_token?.refresh_token,
    };
    const expiresTime = Date.now() + res_token?.expires_in * 1000;
    cookies().set("refresh", expiresTime?.toString(), {
      path: "/",
      priority: "medium",
      maxAge: 15552000,
    });
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await db.user.findUnique({
      where: {
        githubId: String(githubUser.id),
      },
      include: {
        provider: {
          where: {
            name: githubUser?.login,
          },
        },
      },
    });

    if (setup_action === "install") {
      //** App installation */
      const installation = await app.octokit.request(
        "GET /app/installations/{installation_id}",
        {
          installation_id: Number(installation_id),
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      install = installation.data.account as any;
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
      await db.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name: githubUser.name || githubUser.login,
          username: githubUser.login,
          picture: githubUser.avatar_url,
          account: {
            update: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            },
          },
        },
      });
      if (!existingUser.active) {
        await db.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            active: true,
          },
        });
      }

      if (
        setup_action !== "install" &&
        existingUser.provider[0]?.name !== existingUser.username
      ) {
        return Response.redirect(
          `https://github.com/apps/issueclub/installations/new/permissions?target_id=${existingUser.githubId}`
        );
      }

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      if (setup_action === "install") {
        await db.provider.upsert({
          where: { name: install.login as string },
          create: {
            name: install.login,
            accessToken: newAccessToken,
            installationId: Number(installation_id),
            picture: install.avatar_url,
            ...(install.type === "Organization" && {
              ownerType: OwnerTypeState.organization,
            }),
            user: {
              connect: {
                id: existingUser.id,
              },
            },
          },
          update: {
            accessToken: newAccessToken,
            installationId: Number(installation_id),
            picture: install.avatar_url,
            active: true,
          },
        });
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/ok",
        },
      });
    }

    const gitUserEmailRes = await fetch("https://api.github.com/user/emails", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const gitUserEmail: UserEmail[] = await gitUserEmailRes.json();
    const primaryEmail = gitUserEmail?.find((v) => !!v?.primary);
    const userEmail = primaryEmail?.email as string;

    const customer = await stripe.customers.create({
      email: userEmail,
    });
    try {
      const newUser = await db.user.create({
        data: {
          githubId: String(githubUser.id),
          name: githubUser.name || githubUser.login,
          email: userEmail,
          username: githubUser.login,
          picture: githubUser.avatar_url,
          account: {
            create: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              stripeCustomerId: customer.id,
            },
          },
        },
      });

      if (setup_action === "install") {
        await db.provider.upsert({
          where: { name: install?.login },
          create: {
            name: install.login,
            accessToken: newAccessToken,
            installationId: Number(installation_id),
            picture: install.avatar_url,
            ...(install.type === "Organization" && {
              ownerType: OwnerTypeState.organization,
            }),
            user: {
              connect: {
                id: newUser.id,
              },
            },
          },
          update: {
            accessToken: newAccessToken,
            installationId: Number(installation_id),
            picture: install.avatar_url,
            active: true,
          },
        });

        // sendWelcomeEmail({ toMail: newUser.email!, userName: newUser.name! });
        const session = await lucia.createSession(newUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/ok",
          },
        });
      }

      return Response.redirect(
        `https://github.com/apps/issueclub/installations/new/permissions?target_id=${newUser.githubId}`
      );
    } catch {
      return new Response(null, {
        status: 404,
        headers: {
          Location: "/login",
        },
      });
    }
  } catch (e) {
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
        headers: {
          Location: "/login",
        },
      });
    }
    return new Response(null, {
      status: 500,
      headers: {
        Location: "/login",
      },
    });
  }
};

interface UserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
}
interface GitHubUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  login: string;
}
