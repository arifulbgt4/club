/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function GET() {
  try {
    const { session, user } = await validateRequest();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const account = await db.account.findUnique({
      where: { userId: user?.id },
      select: { stripeCustomerId: true },
    });

    if (!account?.stripeCustomerId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const customer: any = await stripe.customers.retrieve(
      account?.stripeCustomerId
    );
    if (!customer || !customer?.invoice_settings?.default_payment_method) {
      return NextResponse.json({ status: 301 });
    }
    const paymentMethod = await stripe.paymentMethods.retrieve(
      customer?.invoice_settings?.default_payment_method
    );
    return NextResponse.json({
      id: paymentMethod.id,
      brand: paymentMethod?.card?.brand,
      last4: paymentMethod?.card?.last4,
    });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { session, user } = await validateRequest();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const account = await db.account.findUnique({
      where: { userId: user?.id },
      select: { stripeCustomerId: true },
    });

    if (!account?.stripeCustomerId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await stripe.customers.update(account?.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: body?.paymentMethodId,
      },
    });
    return new Response("success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
