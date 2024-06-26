import type { NextRequest } from "next/server";
import db from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Bad Request: Missing code", { status: 400 });
  }
  try {
    const { session, user } = await validateRequest();
    if (!session || !user?.stripeCustomerId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      //   client_id: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!,
      //   client_secret: process.env.STRIPE_SECRET_KEY!,
      code,
    });

    console.log("response:q ", response);
    await db.stripeAccount.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        stripeUserId: response.stripe_user_id!,
        accessToken: response.access_token!,
        scope: response.scope!,
        livemode: response.livemode!,
        tokenType: response.token_type!,
        refreshToken: response.refresh_token!,
        stripePublishableKey: response.stripe_publishable_key!,
      },
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/payment",
      },
    });
  } catch (error) {
    console.log("error: ", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
