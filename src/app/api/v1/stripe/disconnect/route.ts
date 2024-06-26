import db from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function GET() {
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

    return new Response("success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
