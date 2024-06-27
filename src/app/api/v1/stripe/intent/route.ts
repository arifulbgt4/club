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
    const issue = await db.issue.findUnique({ where: { id: body?.id } });
    if (!issue) {
      return new Response("Issue not found", { status: 404 });
    }
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(Number(issue.price) * 100),
      currency: "usd",
      metadata: { issueId: issue.id, userId: user.id },
    });
    return new Response(
      JSON.stringify({ clientSecret: intent?.client_secret }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
