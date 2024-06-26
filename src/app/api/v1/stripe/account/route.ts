import db from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  try {
    const { session, user } = await validateRequest();
    if (!session || !user?.stripeCustomerId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Create a Stripe account
    const account = await stripe.accounts.create({
      type: "express",
    });

    await db.user.update({
      where: { id: user.id },
      data: { stripeAccountId: account?.id },
    });

    return new Response(JSON.stringify({ accountId: account?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
