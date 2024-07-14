import { IntentType, IssueState, IssueStatus } from "@prisma/client";
import db from "./db";
import { stripe } from "./stripe";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function acceptPullRequest(intent: any) {
  try {
    if (
      intent?.type === IntentType.paid &&
      intent?.price &&
      intent?.price > 0
    ) {
      const request = await db.request.findUnique({
        where: { id: intent?.requestId as string },
      });
      const devAccount = await db.account.findUnique({
        where: { userId: request?.userId as string },
        select: { id: true, balance: true },
      });

      const ownerAccount = await db.account.findUnique({
        where: { userId: intent?.issue?.userId as string },
        select: { stripeCustomerId: true },
      });

      const stripeIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(intent?.price) * 100),
        currency: "usd",
        automatic_payment_methods: {
          allow_redirects: "never",
          enabled: true,
        },
        customer: ownerAccount?.stripeCustomerId as string,
        metadata: {
          issueId: intent.issueId,
          userId: intent?.issue?.userId as string,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const customer: any = await stripe.customers.retrieve(
        ownerAccount?.stripeCustomerId as string
      );

      const paymentMethod = await stripe.paymentMethods.retrieve(
        customer?.invoice_settings?.default_payment_method
      );
      try {
        const confirm = await stripe.paymentIntents.confirm(stripeIntent?.id, {
          payment_method: paymentMethod?.id,
        });

        if (confirm?.status === "succeeded") {
          const completedIntent = await db.intent.update({
            where: {
              id: intent?.id,
            },
            data: {
              active: false,
              success: true,
              issue: {
                update: {
                  state: IssueState.inactive,
                  status: IssueStatus.default,
                },
              },
              request: {
                update: {
                  user: {
                    update: {
                      available: true,
                    },
                  },
                },
              },
            },
            include: {
              issue: true,
            },
          });
          await db.request.update({
            where: { id: completedIntent?.requestId as string },
            data: {
              issueId: null,
            },
          });

          await db.account.update({
            where: { id: devAccount?.id },
            data: { balance: Number(devAccount?.balance) + intent?.price },
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const completedIntent = await db.intent.update({
        where: {
          id: intent?.id,
        },
        data: {
          active: false,
          success: true,
          issue: {
            update: {
              state: IssueState.inactive,
              status: IssueStatus.default,
            },
          },
          request: {
            update: {
              user: {
                update: {
                  available: true,
                },
              },
            },
          },
        },
        include: {
          issue: true,
        },
      });
      await db.request.update({
        where: { id: completedIntent?.requestId as string },
        data: {
          issueId: null,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}
