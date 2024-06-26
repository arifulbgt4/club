import type { NextRequest } from "next/server";
import db from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function GET(req: NextRequest) {
  try {
    const { session, user } = await validateRequest();
    if (!session || !user?.stripeCustomerId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const account = await db.stripeAccount.findFirst({
      where: { userId: user?.id },
    });
    if (!account) {
      return new Response("Account not found", { status: 400 });
    }

    await stripe.oauth.deauthorize({
      client_id: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID!,
      stripe_user_id: account.stripeUserId!,
    });

    await db.stripeAccount.delete({ where: { id: account.id } });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/payment",
      },
    });
  } catch (error) {
    console.log("error: ", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
