import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { session } = await validateRequest();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    await stripe.paymentMethods.detach(body?.paymentMethodId);
    return new Response("success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
