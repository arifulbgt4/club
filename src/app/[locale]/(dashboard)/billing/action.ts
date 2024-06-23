/* eslint-disable @typescript-eslint/no-explicit-any */
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function getPaymentMethods() {
  const { user } = await validateRequest();
  if (!user?.stripeCustomerId) {
    return {};
  }
  const customer: any = await stripe.customers.retrieve(user.stripeCustomerId);
  const paymentMethods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
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
