/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertTriangleIcon, PlusCircleIcon } from "lucide-react";
import AttachPaymentMethod from "~/components/AttachPaymentMethod";
import { BillingForm } from "~/components/billing-form";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { stripe } from "~/lib/stripe";
import { getUserSubscriptionPlan } from "~/lib/subscription";
import { validateRequest } from "~/server/auth";
import { getPaymentMethods } from "./action";
import getPaymentMethodIcon from "~/components/shared/payment-method-icons";
import Remove from "./Remove";
import SetPrimary from "./SetPrimary";

export const revalidate = 0;
export const dynamic = "force-dynamic";

async function getDatas() {
  const methods = await fetch("/api/v1/stripe/get-payment-methods");
  const rr = await methods.json();
  return rr;
}

export default async function Billing() {
  const { user } = await validateRequest();

  // const subscriptionPlan = await getUserSubscriptionPlan(user?.id as string);

  // // If user has a pro plan, check cancel status on Stripe.
  // let isCanceled = false;
  // if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
  //   const stripePlan = await stripe.subscriptions.retrieve(
  //     subscriptionPlan.stripeSubscriptionId
  //   );
  //   isCanceled = stripePlan.cancel_at_period_end;
  // }

  const { primary, additional } = await getPaymentMethods();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage billing methods</CardTitle>
        <CardDescription>
          Add, update, or remove your billing methods.
        </CardDescription>
        <CardContent className="px-0 pt-10">
          <div>
            <h4 className=" mb-0.5 text-xl font-medium">Primary</h4>
            <p className="mb-3 text-sm text-muted-foreground">
              Your primary billing method is used for all recurring payments.
            </p>
            {primary && (
              <div
                key={primary?.id}
                className=" flex max-w-96 items-center justify-between rounded border p-2.5 pl-4"
              >
                <div className="flex items-center">
                  <div className=" scale-150">
                    {getPaymentMethodIcon(primary?.brand as string)()}
                  </div>

                  <span className=" ml-4 font-medium">
                    <span className=" capitalize"> {primary?.brand}</span>{" "}
                    ending in {primary?.last4}
                  </span>
                </div>
                <Remove id={primary?.id as string} />
              </div>
            )}
          </div>
          {!!additional?.length && (
            <div>
              <h4 className=" mb-1 mt-10 text-xl font-medium">Additional</h4>
              {additional?.map((c) => (
                <div
                  key={c?.id}
                  className=" flex max-w-[600px] items-center justify-between border-b p-5"
                >
                  <div className="flex items-center">
                    <div className=" scale-150">
                      {getPaymentMethodIcon(c?.brand as string)()}
                    </div>{" "}
                    <span className=" ml-4 font-medium">
                      <span className=" capitalize"> {c?.brand}</span> ending in{" "}
                      {c?.last4}
                    </span>
                  </div>
                  <div className="flex">
                    <SetPrimary id={c?.id} />
                    <Remove id={c?.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-1 flex-col items-start justify-start p-0">
          <AttachPaymentMethod />
        </CardFooter>
      </CardHeader>
      {/* <Alert>
        <div className=" flex items-center gap-2">
          <AlertTriangleIcon className="h-5 w-5 shrink-0" />
          <div>
            <AlertDescription>
              <strong>Otask</strong> just demonstrates how to use Stripe in
              Next.js App router. Please use test cards from{" "}
              <a
                href="https://stripe.com/docs/testing#cards"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Stripe docs
              </a>
              .
            </AlertDescription>
          </div>
        </div>
      </Alert>
      <BillingForm
        subscriptionPlan={{
          ...subscriptionPlan,
          isCanceled,
        }}
      />
      */}
    </Card>
  );
}
