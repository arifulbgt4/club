import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function GET() {
  try {
    const { session, user } = await validateRequest();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const url = await stripe.oauth.authorizeUrl({
      client_id: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID!,
      state: user?.id,
      scope: "read_write",
      response_type: "code",
    });

    return new Response(JSON.stringify(url), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
