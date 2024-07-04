import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import db from "~/lib/db";
import { github, lucia } from "~/lib/lucia";
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
          userAccessToken: tokens.accessToken,
        },
      });
      if (!existingUser.activate) {
        await db.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            activate: true,
          },
        });
      }

      if (setup_action !== "install" && existingUser.accessToken === null) {
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
        if (install.type === "Organization") {
          const org = await db.organization.findFirst({
            where: { name: install.login },
          });

          if (!org) {
            await db.organization.create({
              data: {
                name: install.login,
                token: newAccessToken,
                picture: install.avatar_url,
                installId: Number(installation_id),
                user: {
                  connect: {
                    id: existingUser.id,
                  },
                },
              },
            });
          } else {
            await db.organization.update({
              where: {
                id: org.id,
              },
              data: {
                token: newAccessToken,
                installId: Number(installation_id),
                active: true,
                user: {
                  connect: {
                    id: existingUser.id,
                  },
                },
              },
            });
          }
        }
        if (install.type === "User") {
          await db.user.update({
            where: {
              id: existingUser.id,
            },
            data: {
              accessToken: newAccessToken,
              installId: Number(installation_id),
            },
          });
        }
      }

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
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

    const newUser = await db.user.create({
      data: {
        githubId: githubUser.id,
        name: githubUser.name || githubUser.login,
        email: userEmail,
        username: githubUser.login,
        userAccessToken: tokens.accessToken,
        stripeCustomerId: customer.id,
        picture: githubUser.avatar_url,
        ...(setup_action === "install" &&
          install.type === "User" && {
            accessToken: newAccessToken,
            installId: Number(installation_id),
          }),
      },
    });

    if (setup_action === "install") {
      if (install.type === "Organization") {
        await db.organization.create({
          data: {
            name: install.login,
            token: newAccessToken,
            picture: install.avatar_url,
            user: {
              connect: {
                id: newUser.id,
              },
            },
          },
        });
      }

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
          Location: "/",
        },
      });
    }

    return Response.redirect(
      `https://github.com/apps/issueclub/installations/new/permissions?target_id=${newUser.githubId}`
    );
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
