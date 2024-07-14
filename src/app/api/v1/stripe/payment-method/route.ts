import { NextResponse } from "next/server";
import db from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, session } = await validateRequest();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const account = await db.account.findUnique({
      where: { userId: user?.id },
      select: { stripeCustomerId: true },
    });

    let stripeCustomerId = account?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
      });
      await db.account.update({
        where: { userId: user?.id },
        data: { stripeCustomerId: customer.id },
      });
      stripeCustomerId = customer.id;
    }

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(body.paymentMethodId, {
      customer: stripeCustomerId,
    });

    // Set the default payment method
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: body.paymentMethodId,
      },
    });

    return NextResponse.json({
      message: "Payment method attached successfully",
    });
  } catch (error) {
    console.error("Error attaching payment method:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
