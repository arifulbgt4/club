"use client";
import GoBack from "~/components/go-back";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function SingleProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-5 flex items-center">
        <GoBack />
      </div>
      <Elements stripe={stripePromise}>{children}</Elements>
    </>
  );
}
