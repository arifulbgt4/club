import { IssueState } from "@prisma/client";
import db from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { validateRequest } from "~/server/auth";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const { session, user } = await validateRequest();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const intents = await db.intent.count({
      where: {
        active: true,
        issue: {
          state: {
            in: [
              IssueState.inprogress,
              IssueState.published,
              IssueState.reassign,
              IssueState.inreview,
            ],
          },
        },
      },
    });

    if (intents === 0) {
      await stripe.paymentMethods.detach(body?.paymentMethodId);

      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: "card",
      });

      if (!!paymentMethods?.data?.length) {
        await stripe.customers.update(user?.stripeCustomerId, {
          invoice_settings: {
            default_payment_method: paymentMethods?.data[0].id,
          },
        });
      }
      return new Response("success", { status: 200 });
    }

    const initPaymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
    });
    if (initPaymentMethods?.data?.length <= 1) {
      return new Response("There have published paid issues", { status: 301 });
    }

    await stripe.paymentMethods.detach(body?.paymentMethodId);

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: "card",
    });

    if (!!paymentMethods?.data?.length) {
      await stripe.customers.update(user?.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethods?.data[0].id,
        },
      });
    }
    return new Response("success", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
