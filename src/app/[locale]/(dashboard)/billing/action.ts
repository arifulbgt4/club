/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function getPaymentMethods() {
  const { user, session } = await validateRequest();
  if (!session) {
    return {};
  }
  const account = await db.account.findUnique({
    where: { userId: user?.id },
    select: { stripeCustomerId: true },
  });
  const customer: any = await stripe.customers.retrieve(
    account?.stripeCustomerId as string
  );
  const paymentMethods = await stripe.paymentMethods.list({
    customer: account?.stripeCustomerId as string,
    type: "card",
  });

  const data = paymentMethods?.data?.map((p) => {
    if (p.id === customer?.invoice_settings?.default_payment_method) {
      return {
        id: p?.id,
        last4: p?.card?.last4,
        brand: p?.card?.brand,
        primary: true,
      };
    }
    return {
      id: p?.id,
      last4: p?.card?.last4,
      brand: p?.card?.brand,
      primary: false,
    };
  });

  const primary = data?.filter((d) => d?.primary);
  const additional = data?.filter((d) => !d?.primary);

  return { primary: primary[0], additional };
}

export async function getInvoice() {
  const { user, session } = await validateRequest();
  if (!session) {
    return {};
  }
  const account = await db.account.findUnique({
    where: { userId: user?.id },
    select: { stripeCustomerId: true },
  });
  const invoice = await stripe.invoices.list({
    customer: account?.stripeCustomerId as string,
  });

  return invoice;
}
