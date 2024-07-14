import db from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { user, session } = await validateRequest();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const account = await db.account.findUnique({
      where: { userId: user?.id },
      select: { stripeCustomerId: true },
    });
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(Number(body.price) * 100),
      currency: "usd",
      customer: account?.stripeCustomerId as string,
      metadata: { issueId: body.issueId, userId: user.id },
    });
    return new Response(
      JSON.stringify({ clientSecret: intent?.client_secret }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
