import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { user, session } = await validateRequest();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(Number(body.price) * 100),
      currency: "usd",
      customer: user?.stripeCustomerId,
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
