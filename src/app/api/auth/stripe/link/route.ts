import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function GET(req: Request) {
  try {
    const { session, user } = await validateRequest();
    if (!session || !user?.stripeCustomerId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const url = await stripe.oauth.authorizeUrl({
      client_id: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID!,
      redirect_uri: "http://localhost:3000/api/auth/stripe/callback", // Your redirect URI
      state: user?.id, // Optionally pass any state data you need
      scope: "read_write", // Adjust scope as per your needs
      response_type: "code",
    });
    // window.location.href = url;

    console.log("url: ", url);
    // return Response.redirect(url);
    return new Response(JSON.stringify(url), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
